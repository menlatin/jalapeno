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

module.exports = function Login(db,bcrypt,jwt,fs,parse,login_schema,validate,errors,login_pages,error_pages) {
	var login = {
		invalidPostAdmin: function *(next) {
			// ERRORS IN FORM, RETURN TO FORM WITH ERRORS
			if(this.req.userAgent.isDesktop) {
				return yield login_pages.admin;
			}
			// ERRORS FROM API REQUEST, RETURN JSON ERROR
			else {
				var json = db.util.json_response(this.req.formData, this.req.formErrors);
				this.body = json;
			}
		},
		successPostAdmin: function *(next) {
			// SUCCESSFUL POST, RETURN CREATED ADMIN PROFILE
			if(this.req.userAgent.isDesktop) {
				return yield admin_pages.view;
			}
			// SUCCESS FROM API REQUEST, RETURN JSON SUCCESS
			else {
				var json = db.util.json_response(this.req.formData, null);
				this.body = json;
			}
		},
		postAdmin: function *(next) {
			console.log("login.post");
			try {
				var admin_login_pre = yield parse(this);

				// TODO: Did the user enter their email instead of the username?
				// check for "@" symbol and do some direct validation to determine what to check for

				var admin_login_test = validate.schema(login_schema, admin_login_pre);

				console.log("admin_login_test: ", admin_login_test);

				if(admin_login_test.valid) {

					// See if this username exists in the admin database
					var usernameResults = yield db.util.admin_by_username_for_login(admin_login_test.data.username);
					// var emailResults = yield db.util.admin_by_email_for_login(admin_login_test.data.username);

					// Username Exists Once In DB, Compare Passwords
					if(usernameResults.length == 1) {
						var userToCompare = usernameResults[0];

						console.log("userToCompare = ", userToCompare);

						console.log("admin_login_test.data.password = ", admin_login_test.data.password);
						console.log("userToCompare.hash = ", userToCompare.hash);

						if (yield bcrypt.compare(admin_login_test.data.password, userToCompare.hash)) {
							// Password Correct
							console.log("PASSWORD WAS RIGHT");

							// Udpate "login_on" Date for Admin
							var now = new Date();
							var adminUpdate = {login_on: now};
							var loginUpdateResults = yield db.util.admin_update(adminUpdate, userToCompare.id);

							if(!loginUpdateResults) {
								// Failed to Update Last Login Date When Logging In
								this.req.formData = null;
								this.req.formErrors = [errors.DB_ERROR("issues updating last login date")];
								return yield login.invalidPostAdmin;
							}
							else {
								// You've logged in successfuly
								// Set JWT and direct to admin profile
								var privateKey 	= fs.readFileSync('ssl/demo.rsa');
								var claims = userToCompare.username;
								var token = jwt.sign(claims, privateKey, {
									algorithm: 'RS256',
									expiresInMinutes: 120
								});

								// this.set("Authorization", "Bearer "+token);

								this.body = {token:token};
							}


						}
						else {
							console.log("PASSWORD WAS WRONG");

							// Wrong Password
							this.req.formData = null;
							this.req.formErrors = [errors.login.PASSWORD_INCORRECT("password")];
							return yield login.invalidPostAdmin;
						}
					}
					else {
						// Username doesn't exist for comparison
							this.req.formData = null;
							this.req.formErrors = [errors.login.USERNAME_NOT_FOUND("username")];
							return yield login.invalidPostAdmin;
					}
				}
				else {
					// Request was not valid,
					this.req.formData = admin_login_pre;
					this.req.formErrors = admin_login_test.errors;
					return yield login.invalidPostAdmin;
				}
			}
			catch(err) {
				// Save Input Which Caused an Error Logging Admin In
				this.req.formData = admin_login_pre;

				// Database Connectivity Issue
				if(err.code == "ECONNREFUSED") {
					this.req.formErrors = [errors.DB_ERROR("database connection issue")];
					return yield login.invalidPostAdmin;
				}
				// Malformed Cypher Query
				else if (err.neo4j) {
					if (err.neo4j.code && err.neo4j.code == "Neo.ClientError.Statement.InvalidSyntax") {
						this.req.formErrors = [errors.DB_ERROR("malformed query")];
						return yield login.invalidPostAdmin;
					}
					else {
						console.log("huhhh");
						this.req.formErrors = [errors.DB_ERROR("neo4j error")];
						return yield login.invalidPost;
					}

				}
				else {
					// Unknown Error
					console.log('unknown: ', err);
					this.req.formErrors = [errors.UNKNOWN_ERROR("logging in admin")];
					return yield login.invalidPostAdmin;
				}
			}
		},
		invalidPostUser: function *(next) {
			console.log("login.invalidPostUser");
		},
		successPostUser: function *(next) {
			console.log("login.successPostUser");
		},
		postUser: function *(next) {
			console.log("login.postUser");
		}
	};
	return login;
};