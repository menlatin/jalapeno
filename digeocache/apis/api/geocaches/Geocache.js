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

module.exports = function Geocache(db,bcrypt,parse,geocache_schema,validate,errors,geocache_pages) {
	var geocache = {
		json_response: function json_response(geocaches) {
			var g = {
				data: geocaches
			};
			return JSON.stringify(g, null, 4);
		},
		post: function *(next) {
			console.log("geocache.post");
			try {
				var geocache_pre = yield parse(this);
				var geocache_test = validate.geocache(geocache_pre, geocache.schema);

				if(geocache_test.valid) {
					// Generate salt/hash using bcrypt
					var salt = yield bcrypt.genSalt(10);
					var hash = yield bcrypt.hash(geocache_test.data.password, salt);

					// Delete password key/value from post object, replace w/hash
					var pw = geocache_test.data.password;
					delete geocache_test.data.password;
					geocache_test.data.hash = hash;

					// Add automatic date fields
					var now = new Date;
					geocache_test.data.created_on = now;
					geocache_test.data.updated_on = now;
					geocache_test.data.login_on = "";

					var results = (yield db.util.geocache_insert(geocache_test.data));

					if (!results) {
						var json = errors.geocaches.DROP_ERROR;
						this.status = 200;
						this.body = json;
					}
					else {
						var json = geocache.json_response(results);
						console.log(json);
						this.status = 200;
						this.body = json;
					}
				}
			}
			catch(e) {
				var json = errors.geocaches.UNKNOWN_ERROR;
				this.status = 200;
				this.body = json;
			}
		},
		get: function *(next) {
			console.log("geocache.get");
			try {
				var id_test = validate.id(this.params.id);

				// ID Provided to GET -> Return User w/ID as JSON Object
				if(id_test.valid) {
					var results = yield db.util.geocache_by_id(id_test.data.toString());
					if (!results) {
						var json = errors.geocaches.DOES_NOT_EXIST;
						this.status = 200;
						this.body = json;
					}
					else {
						var json = geocache.json_response(results);
						console.log(json);				
						this.status = 200;
						this.body = json;
					}	
				}
				// ID Not Provided -> Return All Users as JSON Array
				else {
					var results = yield db.util.geocaches_all();
					if(!results) {
						var json = errors.geocaches.LIST_ERROR;
						this.status = 200;
						this.body = json;
					}
					else {
						var json = geocache.json_response(results);
						this.status = 200;
						this.body = json;
					}
				}
			}
			catch(e) {
				var json = errors.geocaches.UNKNOWN_ERROR;
				this.status = 200;
				this.body = json;
			}
		},
		put: function *(next) {
			console.log("geocache.put");
			try {
				var geocache_pre = yield parse(this);
				var geocache_test = validate.geocache(geocache_pre, geocache.schema);

				if(geocache_test.valid) {
					// Generate salt/hash using bcrypt
					var salt = yield bcrypt.genSalt(10);
					var hash = yield bcrypt.hash(geocache_test.data.password, salt);

					// Delete password key/value from post object, replace w/hash
					var pw = geocache_test.data.password;
					delete geocache_test.data.password;
					geocache_test.data.hash = hash;

					// Add automatic date fields
					var now = new Date;
					geocache_test.data.created_on = now;
					geocache_test.data.updated_on = now;
					geocache_test.data.login_on = "";

					var results = (yield db.util.geocache_insert(geocache_test.data));

					if (!results) {
						var json = errors.geocaches.REGISTER_ERROR;
						this.status = 200;
						this.body = json;
					}
					else {
						var json = geocache.json_response(results);
						console.log(json);
						this.status = 200;
						this.body = json;
					}
				}
			}
			catch(e) {
				var json = errors.geocaches.UNKNOWN_ERROR;
				this.status = 200;
				this.body = json;
			}
		},
		del: function *(next) {
			console.log("geocache.del");
			try {
				var id = this.params.id
				var success = true;
				this.assert(success, 500, 'Failed to delete geocache');
			}
			catch(e) {
				this.redirect('/error');
			}
		}
	};
	return geocache;
};