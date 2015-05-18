// The MIT License (MIT)

// Copyright (c) 2015 Elliott Richerson, Carlos Aari Lotfipour

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in 
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

module.exports = function UserLogin(db, bcrypt, fs, jwt, parse, errors, validate, utility) {

    var userLogin = {
        schema: [{
            attribute: "username",
            type: "text",
            required: true,
            auto: false,
            test: validate.regex.test.user.USERNAME
        }, {
            attribute: "password",
            type: "password",
            required: true,
            auto: false,
            test: validate.regex.test.user.PASSWORD
        }],
        invalidPost: function * (next) {
            var json = utility.json_response(this.req.data, this.req.errors);
            this.type = "application/json";
            this.body = json;
        },
        successPost: function * (next) {
            var json = utility.json_response(this.req.data, null);
            this.type = "application/json";
            this.body = json;
        },
        post: function * (next) {
            try {
                var isEmailAsUsername = false;
                var login_pre = yield parse(this);

                // If the username field appears to contain an email address (has an @ symbol)
                // then create a modified schema object with proper email regex test
                var modifiedSchema = userLogin.schema;
                var schemaIndexUsername = modifiedSchema.map(function(s) {
                    return s.attribute;
                }).indexOf('username');

                if (login_pre.username.indexOf('@') !== -1) {
                    isEmailAsUsername = true;
                    modifiedSchema[schemaIndexUsername].test = validate.regex.test.user.EMAIL;
                } else {
                    modifiedSchema[schemaIndexUsername].test = validate.regex.test.user.USERNAME;
                }

                var login_test = validate.schema(modifiedSchema, login_pre);
                if (login_test.valid) {

                    // See if this username or email exists in the user database
                    var userResults = null;
                    if (isEmailAsUsername) {
                        userResults = yield db.util.user_by_email_for_login(login_test.data.username);
                    } else {
                        userResults = yield db.util.user_by_username_for_login(login_test.data.username);
                    }

                    // Admin Exists Once In DB, Compare Passwords
                    if (userResults.length == 1) {
                        var userToCompare = userResults[0];

                        if (yield bcrypt.compare(login_test.data.password, userToCompare.hash)) {
                            // Password Correct

                            // Udpate "login_on" Date for Admin
                            var now = new Date();
                            var userUpdate = {
                                login_on: now
                            };
                            var loginUpdateResults = yield db.util.user_update(userUpdate, userToCompare.id);

                            if (!loginUpdateResults) {
                                // Failed to Update Last Login Date When Logging In
                                this.req.data = login_pre;
                                var errorArray = [];
                                errorArray.push(errors.login.LOGIN_FAILURE());
                                this.req.errors = errorArray;
                                return yield userLogin.invalidPost;
                            } else {
                                // You've logged in successfuly
                                // Set JWT and direct to user profile
                                var privateKey = fs.readFileSync('ssl/demo.rsa');
                                var claims = {
                                    iss: "digeocache",
                                    username: userToCompare.username,
                                    admin: false,
                                    pri: {
                                        admin: [],
                                        user: ["create", "read", "update", "delete"]
                                    }
                                };
                                var token = jwt.sign(claims, privateKey, {
                                    algorithm: 'RS256',
                                    expiresInMinutes: 120
                                });

                                this.req.data = [{
                                    token: token
                                }];
                                return yield userLogin.successPost;
                            }
                        } else {
                            this.req.data = login_pre;
                            var errorArray = [];
                            errorArray.push(errors.login.PASSWORD_INCORRECT('password'));
                            this.req.errors = errorArray;
                            return yield userLogin.invalidPost;
                        }
                    } else {
                        // Admin doesn't exist for comparison
                        this.req.data = login_pre;
                        var errorArray = [];
                        errorArray.push(errors.login.USERNAME_NOT_FOUND('username'));
                        this.req.errors = errorArray;
                        return yield userLogin.invalidPost;
                    }
                } else {
                    // Request was not valid,
                    this.req.data = login_pre;
                    this.req.errors = login_test.errors;
                    return yield userLogin.invalidPost;
                }
            } catch (err) {
                // Save Input Which Caused an Error
                this.req.data = login_pre;

                // Database Connectivity Issue
                if (err.code == "ECONNREFUSED") {
                    this.req.errors = [errors.DB_ERROR("database connection issue")];
                    return yield userLogin.invalidPost;
                }
                // Malformed Cypher Query
                else if (err.neo4j) {
                    if (err.neo4j.code && err.neo4j.code == "Neo.ClientError.Statement.InvalidSyntax") {
                        this.req.errors = [errors.DB_ERROR("malformed query")];
                        return yield userLogin.invalidPost;
                    } else {
                        this.req.errors = [errors.DB_ERROR("neo4j error")];
                        return yield userLogin.invalidPost;
                    }
                } else {
                    // Unknown Error
                    this.req.errors = [errors.UNKNOWN_ERROR("authenticating user" + err)];
                    return yield userLogin.invalidPost;
                }
            }
        }
    };
    return userLogin;
};