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

module.exports = function Admin(db,bcrypt,parse,admin_schema,validate,errors,admin_pages,error_pages) {
	var admin = {
		invalidPost: function *(next) {
			// ERRORS IN FORM, RETURN TO FORM WITH ERRORS
			if(this.req.userAgent.isDesktop) {
				return yield admin_pages.create;
			}
			// ERRORS FROM API REQUEST, RETURN JSON ERROR
			else {
				var json = db.util.json_response(this.req.formData, this.req.formErrors);
				this.body = json;
			}
		},
		successPost: function *(next) {
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
		post: function *(next) {
			console.log("admin.post");
			try {
				var admin_pre = yield parse(this);
				var admin_test = validate.schema(admin_schema, admin_pre);

				console.log("admin_test: ", admin_test);

				if(admin_test.valid) {

					// Make sure this username/email are not already in use
					var usernameResults = yield db.util.admin_by_username(admin_test.data.username);
					var emailResults = yield db.util.admin_by_email(admin_test.data.email);

					// Username Already In DB
					if(usernameResults.length != 0) {
						this.req.formData = admin_pre;
						this.req.formErrors = [errors.user.USERNAME_TAKEN("username")];
						return yield admin.invalidPost;
					}

					// Email Already in DB
					if(emailResults.length != 0) {
						this.req.formData = admin_pre;
						this.req.formErrors = [errors.user.EMAIL_TAKEN("email")];
						return yield admin.invalidPost;
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

					var results = yield db.util.admin_create(admin_test.data);
					if (!results) {
						// DB Failure to POST
						this.req.formData = null;
						this.req.formErrors = [errors.DB_ERROR("failed to create admin")];
						return yield admin.invalidPost;
					}
					else {
						// Request was successful.
						this.req.viewData = results;
						return yield admin.successPost;
					}
				}
				else {
					// Request was not valid,
					this.req.formData = admin_pre;
					this.req.formErrors = admin_test.errors;
					return yield admin.invalidPost;
				}
			}
			catch(err) {
				// Save Input Which Caused an Error
				this.req.formData = admin_pre;

				// Database Connectivity Issue
				if(err.code == "ECONNREFUSED") {
					this.req.formErrors = [errors.DB_ERROR("database connection issue")];
					return yield admin.invalidPost;
				}
				// Malformed Cypher Query
				else if (err.neo4j.code == "Neo.ClientError.Statement.InvalidSyntax") {
					this.req.formErrors = [errors.DB_ERROR("malformed query")];
					return yield admin.invalidPost;
				}
				else {
					// Unknown Error
					this.req.formErrors = [errors.UNKNOWN_ERROR("creating admin")];
					return yield admin.invalidPost;
				}
			}
		},
		invalidGet: function *(next) {
			// ERRORS IN GET REQUEST, SHOW ERROR PAGE
			if(this.req.userAgent.isDesktop) {
				return yield error_pages.generic;
			}
			// ERRORS FROM API REQUEST, RETURN JSON ERROR
			else {
				var json = db.util.json_response(null, this.req.formErrors);
				this.body = json;
			}
		},
		successGet: function *(next) {
			// SUCCESSFUL POST, RETURN CREATED ADMIN PROFILE
			if(this.req.userAgent.isDesktop) {
				return yield admin_pages.view;
			}
			// SUCCESS FROM API REQUEST, RETURN JSON SUCCESS
			else {
				var json = db.util.json_response(this.req.viewData, null);
				this.body = json;
			}
		},
		get: function *(next) {
			console.log("admin.get");

			function getQueryVariable(queryStr, queryVar) {
				var queryVars = queryStr.split('&');
				for(var i = 0; i < queryVars.length; i++) {
					var pair = queryVars[i].split('=');
					if(decodeURIComponent(pair[0]) == queryVar) {
						return decodeURIComponent(pair[1]);
					}
				}
				return null;
			}

			try {
				var id_test = validate.id(this.params.id);

				// ID Provided to GET -> Return User w/ID as JSON Object
				if(id_test.valid) {
					var results = yield db.util.admin_by_id(id_test.data.toString());
					if (!results || results.length == 0) {
						this.req.errorMessage = "Could not retreive admin with this id."
						this.req.formErrors = [errors.user.ID_NOT_FOUND()];
						return yield admin.invalidGet;
					}
					else {
						this.req.viewData = results;
						return yield admin.successGet;
					}	
				}
				// ID Not Provided
				else if (!id_test.valid && (this.params.id === undefined || this.params.id === null)){

					// Check URL querystring for username or email filter
					var queryUsername = getQueryVariable(this.request.querystring, "username");
					var queryEmail = getQueryVariable(this.request.querystring, "email");

					if(queryUsername && queryEmail) {
						this.req.errorMessage = "Admin username and email must be queried independently.";
						this.req.formErrors = [errors.UNKNOWN_ERROR("username and email must be queried independently")];
						return yield admin.invalidGet;
					}
					else if(queryUsername) {
						var testUsername = validate.attribute(admin_schema, queryUsername, "username");
						if(testUsername.valid) {
							var usernameResults = yield db.util.admin_by_username(testUsername.data);
							if(!usernameResults || usernameResults.length == 0) {
								this.req.errorMessage = "Could not retrieve admin by username.";
								this.req.formErrors = [errors.DB_ERROR("failed to get admin by username")];
								return yield admin.invalidGet;
							}
							else {
								this.req.viewData = usernameResults;
								return yield admin.successGet;
							}
						}
						else {
							this.req.errorMessage = "Queried username is not a valid username."
							this.req.formErrors = testUsername.errors;
							return yield admin.invalidGet;
						}
					}
					else if(queryEmail) {
						var testEmail = validate.attribute(admin_schema, queryEmail, "email");
						if(testEmail.valid) {
							var emailResults = yield db.util.admin_by_email(testEmail.data);
							if(!emailResults || emailResults.length == 0) {
								this.req.errorMessage = "Could not retrieve admin by email.";
								this.req.formErrors = [errors.DB_ERROR("failed to get admin by email")];
								return yield admin.invalidGet;
							}
							else {
								this.req.viewData = emailResults;
								return yield admin.successGet;
							}
						}
						else {
							this.req.errorMessage = "Queried email is not a valid email."
							this.req.formErrors = testEmail.errors;
							return yield admin.invalidGet;
						}
					}
					// If username and email query parameters not present, return all admins
					var results = yield db.util.admins_all();
					if(!results) {
						this.req.errorMessage = "Could not retrieve admin list.";
						this.req.formErrors = [errors.DB_ERROR("failed to get admins")];
						return yield admin.invalidGet;
					}
					else if(results.length == 0) {
						this.req.errorMessage = "There are no admins in your database.";
						this.req.formErrors = [errors.UNKNOWN_ERROR("there are no admins in your database")];
						return yield admin.invalidGet;
					}
					else {
						this.req.viewData = results;
						return yield admin.successGet;
					}
				}
				// Invalid URL Construction
				else {
					this.req.errorMessage = "Admin id must be a valid integer."
					this.req.formErrors = [errors.UNKNOWN_ERROR("bad url getting admin(s)")];
					return yield admin.invalidGet;
				}
			}
			catch(e) {
				// Unknown Error
				this.req.errorMessage = "Could not retrieve admin data.";
				this.req.formErrors = [errors.UNKNOWN_ERROR("getting admin(s)")];
				return yield admin.invalidGet;
			}
		},
		put: function *(next) {
			console.log("admin.put");
			try {
				var admin_pre = yield parse(this);
				var admin_test = validate.schema(admin_schema, admin_pre);

				if(admin_test.valid) {
					// Generate salt/hash using bcrypt
					var salt = yield bcrypt.genSalt(10);
					var hash = yield bcrypt.hash(admin_test.data.password, salt);

					// Delete password key/value from post object, replace w/hash
					var pw = admin_test.data.password;
					delete admin_test.data.password;
					admin_test.data.hash = hash;

					// Add automatic date fields
					var now = new Date;
					admin_test.data.created_on = now;
					admin_test.data.updated_on = now;
					admin_test.data.login_on = "";

					var results = (yield db.util.admin_update(admin_test.data));

					if (!results) {
						var json = errors.admins.REGISTER_ERROR;
						this.status = 200;
						this.body = json;
					}
					else {
						var json = db.util.json_response(results);
						console.log(json);
						this.status = 200;
						this.body = json;
					}
				}
			}
			catch(e) {
				var json = errors.admins.UNKNOWN_ERROR;
				this.status = 200;
				this.body = json;
			}
		},
		del: function *(next) {
			console.log("admin.del");
			try {
				var id = this.params.id
				var success = true;
				this.assert(success, 500, 'Failed to delete admin');
			}
			catch(e) {
				this.redirect('/error');
			}
		}
	};
	return admin;
};