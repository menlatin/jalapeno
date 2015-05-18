// [
		{
		    attribute: "title",
		    type: String,
		    required: true,
		    auto: false,
		    test: validate.regex.test.geocache.TITLE
		}, {
		    attribute: "message",
		    type: String,
		    required: true,
		    auto: false,
		    test: validate.regex.test.geocache.MESSAGE
		}, {
		    attribute: "lat",
		    type: Number,
		    required: true,
		    auto: false,
		    test: validate.regex.test.geocache.LATITUDE
		}, {
		    attribute: "lng",
		    type: Number,
		    auto: false,
		    required: true,
		    auto: false,
		    test: validate.regex.test.geocache.LONGITUDE
		}, {
		    attribute: "currency",
		    type: String,
		    required: true,
		    auto: false,
		    test: validate.regex.test.geocache.CURRENCY
		}, {
		    attribute: "amount",
		    type: Number,
		    required: true,
		    auto: false,
		    test: validate.regex.test.geocache.AMOUNT
		}, {
		    attribute: "is_physical",
		    type: Boolean,
		    required: true
		    auto: false,
		    test: validate.regex.test.geocache.IS_PHYSICAL
		}, {
		    attribute: "delay",
		    type: Number,
		    required: true,
		    auto: false,
		    test: validate.regex.test.geocache.DELAY
		}, {
		    attribute: "drop_count",
		    type: Number,
		    required: true,
		    auto: true
		}, {
		    attribute: "dropped_on",
		    type: Date,
		    required: true,
		    auto: true
		}
// 	]

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

module.exports = function Geocache(db, bcrypt, parse, errors, validate, jwt, utility) {

    var geocache = {
        schema: [{
            attribute: "username",
            type: "text",
            required: true,
            auto: false,
            test: validate.regex.test.admin.USERNAME
        }, {
            attribute: "password",
            type: "password",
            required: true,
            auto: false,
            test: validate.regex.test.admin.PASSWORD
        }, {
            attribute: "email",
            type: "text",
            required: true,
            auto: false,
            test: validate.regex.test.admin.EMAIL
        }, {
            attribute: "birthday",
            type: "date",
            required: false,
            auto: false,
            test: validate.dates.test.admin.BIRTHDAY
        }, {
            attribute: "phone",
            type: "text",
            required: false,
            auto: false,
            test: validate.regex.test.admin.PHONE
        }, {
            attribute: "firstname",
            type: "text",
            required: false,
            auto: false,
            test: validate.regex.test.admin.FIRSTNAME
        }, {
            attribute: "lastname",
            type: "text",
            required: false,
            auto: false,
            test: validate.regex.test.admin.LASTNAME
        }, {
            attribute: "created_on",
            type: "date",
            required: false,
            auto: true
        }, {
            attribute: "updated_on",
            type: "date",
            required: false,
            auto: true
        }, {
            attribute: "login_on",
            type: "date",
            required: false,
            auto: true
        }],
        success: function(data) {
            return function * (next) {
                var json = utility.json_response(data, null);
                this.type = "application/json";
                this.body = json;
            };
        },
        invalid: function(errors) {
            return function * (next) {
                var json = utility.json_response(null, errors);
                this.type = "application/json";
                this.body = json;
            };
        },
        invalidPost: function(pre, errors) {
            return function * (next) {
                // Remove Password From Returned Prefill
                if (pre && pre.password) {
                    delete pre.password;
                }
                var json = utility.json_response(pre, errors);
                this.type = "application/json";
                this.body = json;
            };
        },
        post: function * (next) {
            // console.log("admin.post");
            try {
                // TODO: Be sure this is being requested by authenticated admin w/proper privileges

                var admin_pre = yield parse(this);
                var admin_test = validate.schema(admin.schema, admin_pre);
                if (admin_test.valid) {
                    // Check if username / email already in use
                    var checkUsername = yield db.admin_username_taken(admin_test.data.username);
                    if (checkUsername.success) {
                        if (checkUsername.taken) {
                            return yield geocache.invalidPost(admin_pre, [errors.user.USERNAME_TAKEN("username")]);
                        }
                    } else {
                        return yield geocache.invalidPost(admin_pre, checkUsername.errors);
                    }
                    var checkEmail = yield db.admin_email_taken(admin_test.data.email);
                    if (checkEmail.success) {
                        if (checkEmail.taken) {
                            return yield geocache.invalidPost(admin_pre, [errors.user.EMAIL_TAKEN("email")]);
                        }
                    } else {
                        return yield geocache.invalidPost(admin_pre, checkEmail.errors);
                    }

                    // Generate salt/hash using bcrypt
                    var salt = yield bcrypt.genSalt(10);
                    var hash = yield bcrypt.hash(admin_test.data.password, salt);

                    // Delete password key/value from post object, replace w/hash
                    var pw = admin_test.data.password;
                    delete admin_test.data.password;
                    admin_test.data.hash = hash;

                    // Add automatic date fields
                    var now = new Date();
                    admin_test.data.created_on = now;
                    admin_test.data.updated_on = now;
                    admin_test.data.login_on = "";
                    // Request DB Create Node and Respond Accordingly
                    var create = yield db.admin_create(admin_test.data);
                    if (create.success) {
                        return yield geocache.success(create.data);
                    } else {
                        return yield geocache.invalidPost(admin_pre, create.errors);
                    }

                } else {
                    // Request was not valid,
                    return yield geocache.invalidPost(admin_pre, admin_test.errors);
                }
            } catch (e) {
                return yield geocache.catchErrors(e, admin_pre);
            }
        },
        get: function * (next) {
            // console.log("admin.get");
            try {
                // TODO: Be sure this is being requested by authenticated admin w/proper privileges

                // No parameter provided in URL
                if (this.params.id == undefined && this.params.id == null) {
                    // Return all admins      
                    var allAdmins = yield db.admins_all();
                    if (allAdmins.success) {
                        return yield geocache.success(allAdmins.data);
                    } else {
                        return yield geocache.invalid(allAdmins.errors);
                    }
                }
                // Parameter exists in URL
                else {
                    // Try to identify existing admin
                    var findAdmin = yield geocache.identifyFromURL(this.params.id);
                    if (findAdmin.success) {
                        return yield geocache.success(findAdmin.data);
                    } else {
                        return yield geocache.invalid(findAdmin.errors);
                    }
                }
            } catch (e) {
                // Unknown Error
                return yield geocache.catchErrors(e, null);
            }
        },
        put: function * (next) {
            // console.log("admin.put");
            try {
                // TODO: Be sure this is being requested by authenticated admin w/proper privileges

                // Request payload
                var admin_pre = yield parse(this);

                // No parameter provided in URL
                if (this.params.id == undefined && this.params.id == null) {
                    // Perhaps request is for a batch update
                    // batch_test = validate.schemaForBatchUpdate(admin.schema, admin_pre);
                    // if (batch_test.valid) {
                    //     // Loop through validated data and perform updates
                    // }
                    // else {
                    //     return yield geocache.invalidPost(admin_pre, batch_test.errors);
                    // }
                    return yield geocache.invalidPost(admin_pre, [errors.UNSUPPORTED()]);
                }
                // Parameter exists in URL
                else {
                    // Try to identify existing admin
                    var existingAdmin = undefined;
                    var findAdmin = yield geocache.identifyFromURL(this.params.id);
                    if (findAdmin.success) {
                        existingAdmin = findAdmin.data;
                    } else {
                        return yield geocache.invalidPost(admin_pre, findAdmin.errors);
                    }
                    // If we got this far, we must have found a match.
                    // Now validate what we're trying to update
                    admin_test = validate.schemaForUpdate(admin.schema, admin_pre);
                    if (admin_test.valid) {
                        // Is the admin trying to change their password?
                        if (admin_test.data.password) {
                            // Generate new salt/hash using bcrypt
                            var salt = yield bcrypt.genSalt(10);
                            var hash = yield bcrypt.hash(admin_test.data.password, salt);
                            // Delete password key/value from update object, replace w/hash
                            var pw = admin_test.data.password;
                            delete admin_test.data.password;
                            admin_test.data.hash = hash;
                        }
                        // Add automatic date fields
                        var now = new Date();
                        admin_test.data.updated_on = now;
                        // Request DB update
                        var adminUpdate = yield db.admin_update(admin_test.data, existingAdmin.id);
                        if (adminUpdate.success) {
                            return yield geocache.success(adminUpdate.data);
                        } else {
                            return yield geocache.invalidPost(admin_pre, adminUpdate.errors);
                        }
                    } else {
                        return yield geocache.invalidPost(admin_pre, admin_test.errors);
                    }
                }
            } catch (e) {
                return yield geocache.catchErrors(e, admin_pre);
            }
        },
        del: function * (next) {
            // console.log("admin.del");
            try {
                // TODO: Be sure this is being requested by authenticated admin w/proper privileges

                // Request payload
                var admin_pre = yield parse(this);

                // No parameter provided in URL
                if (this.params.id == undefined && this.params.id == null) {
                    // Perhaps request is for a batch delete
                    // batch_test = validate.schemaForBatchDelete(admin.schema, admin_pre);
                    // if (batch_test.valid) {
                    //     // Loop through validated data and perform deletes
                    // }
                    // else {
                    //     return yield geocache.invalidPost(admin_pre, batch_test.errors);
                    // }
                    return yield geocache.invalidPost(admin_pre, [errors.UNSUPPORTED()]);
                }
                // Parameter exists in URL
                else {
                    // Try to identify existing admin
                    var existingAdmin = undefined;
                    var findAdmin = yield geocache.identifyFromURL(this.params.id);
                    if (findAdmin.success) {
                        existingAdmin = findAdmin.data;
                    } else {
                        return yield geocache.invalidPost(admin_pre, findAdmin.errors);
                    }
                    // If we got this far, we must have found a match to delete.
                    var adminDelete = yield db.admin_delete(admin_test.data, existingAdmin.id);
                    if (adminDelete.success) {
                        return yield geocache.success(adminDelete.data);
                    } else {
                        return yield geocache.invalidPost(admin_pre, adminDelete.errors);
                    }
                }
            } catch (e) {
                return yield geocache.catchErrors(e, admin_pre);
            }
        },
        identifyFromURL: function(params_id) {
            return function * (next) {
                // Try to identify existing admin
                var response = {};
                var id_test = validate.id(params_id);
                var username_test = validate.attribute(admin.schema, params_id, "username");
                var email_test = validate.attribute(admin.schema, params_id, "email");

                if (id_test.valid) {
                    var adminByID = yield db.admin_by_id(id_test.data.toString());
                    if (adminByID.success) {
                        response.success = true;
                        response.data = adminByID.data;
                        return response;
                    } else {
                        response.success = false;
                        response.errors = adminByID.errors;
                        return response;
                    }
                } else if (username_test.valid) {
                    var adminByUsername = yield db.admin_by_username(username_test.data);
                    if (adminByUsername.success) {
                        response.success = true;
                        response.data = adminByUsername.data;
                        return response;
                    } else {
                        response.success = false;
                        response.errors = adminByUsername.errors;
                        return response;
                    }
                } else if (email_test.valid) {
                    var adminByEmail = yield db.admin_by_email(email_test.data);
                    if (adminByEmail.success) {
                        response.success = true;
                        response.data = adminByEmail.data;
                        return response;
                    } else {
                        response.success = false;
                        response.errors = adminByEmail.errors;
                        return response;
                    }
                } else {
                    response.success = false;
                    response.errors = [errors.admin.UNIDENTIFIABLE()];
                    return response;
                }
            };
        },
        catchErrors: function(err, pre) {
            return function * (next) {
                // Database Connectivity Issue
                if (err.code == "ECONNREFUSED") {
                    return yield geocache.invalidPost(pre, [errors.DB_ERROR("database connection issue")]);
                }
                // Malformed Cypher Query
                else if (err.neo4j) {
                    if (err.neo4j.code && err.neo4j.code == "Neo.ClientError.Statement.InvalidSyntax") {
                        return yield geocache.invalidPost(pre, [errors.DB_ERROR("malformed query")]);
                    } else {
                        return yield geocache.invalidPost(pre, [errors.DB_ERROR("neo4j error")]);
                    }
                } else {
                    // Unknown Error
                    if (err.success !== undefined) {
                        return yield geocache.invalidPost(pre, err.errors);
                    } else {
                        return yield geocache.invalidPost(pre, [errors.UNKNOWN_ERROR("loggin in admin --- " + err)]);
                    }
                }
            };
        }
    }
    return geocache;
};