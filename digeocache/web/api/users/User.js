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

module.exports = function User(db,bcrypt,parse,user_schema,validate,errors,user_pages) {
	var user = {
		json_response: function json_response(users) {
			var u = {
				data: users
			};
			return JSON.stringify(u, null, 4);
		},
		post: function *(next) {
			console.log("user.post");
			try {
				var user_pre = yield parse(this);
				var user_test = validate.user(user_pre, user_schema);

				if(user_test.valid) {
					// Generate salt/hash using bcrypt
					var salt = yield bcrypt.genSalt(10);
					var hash = yield bcrypt.hash(user_test.data.password, salt);

					// Delete password key/value from post object, replace w/hash
					var pw = user_test.data.password;
					delete user_test.data.password;
					user_test.data.hash = hash;

					// Add automatic date fields
					var now = new Date;
					user_test.data.created_on = now;
					user_test.data.updated_on = now;
					user_test.data.login_on = "";

					var results = (yield db.util.user_create(user_test.data));

					if (!results) {
						var json = errors.users.REGISTER_ERROR;
						this.status = 200;
						this.body = json;
					}
					else {
						var json = user.json_response(results);
						console.log(json);
						this.status = 200;
						this.body = json;
					}
				}
			}
			catch(e) {
				var json = errors.users.UNKNOWN_ERROR;
				this.status = 200;
				this.body = json;
			}
		},
		get: function *(next) {
			console.log("user.get");
			try {
				var id_test = validate.id(this.params.id);

				// ID Provided to GET -> Return User w/ID as JSON Object
				if(id_test.valid) {
					var results = yield db.util.user_by_id(id_test.data.toString());
					if (!results) {
						var json = errors.users.DOES_NOT_EXIST;
						this.status = 200;
						this.body = json;
					}
					else {
						var json = user.json_response(results);
						console.log(json);				
						this.status = 200;
						this.body = json;
					}	
				}
				// ID Not Provided -> Return All Users as JSON Array
				else {
					var results = yield db.util.users_all();
					if(!results) {
						var json = errors.users.LIST_ERROR;
						this.status = 200;
						this.body = json;
					}
					else {
						var json = user.json_response(results);
						this.status = 200;
						this.body = json;
					}
				}
			}
			catch(e) {
				var json = errors.users.UNKNOWN_ERROR;
				this.status = 200;
				this.body = json;
			}
		},
		put: function *(next) {
			console.log("user.put");
			try {
				var user_pre = yield parse(this);
				var user_test = validate.user(user_pre, user_schema);

				if(user_test.valid) {
					// Generate salt/hash using bcrypt
					var salt = yield bcrypt.genSalt(10);
					var hash = yield bcrypt.hash(user_test.data.password, salt);

					// Delete password key/value from post object, replace w/hash
					var pw = user_test.data.password;
					delete user_test.data.password;
					user_test.data.hash = hash;

					// Add automatic date fields
					var now = new Date;
					user_test.data.created_on = now;
					user_test.data.updated_on = now;
					user_test.data.login_on = "";

					var results = (yield db.util.user_update(user_test.data));

					if (!results) {
						var json = errors.users.REGISTER_ERROR;
						this.status = 200;
						this.body = json;
					}
					else {
						var json = user.json_response(results);
						console.log(json);
						this.status = 200;
						this.body = json;
					}
				}
			}
			catch(e) {
				var json = errors.users.UNKNOWN_ERROR;
				this.status = 200;
				this.body = json;
			}
		},
		del: function *(next) {
			console.log("user.del");
			try {
				var id = this.params.id
				var success = true;
				this.assert(success, 500, 'Failed to delete user');
			}
			catch(e) {
				this.redirect('/error');
			}
		}
	};
	return user;
};