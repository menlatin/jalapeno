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

var bcrypt = require('co-bcrypt');

var Security = {
	authenticate: function authenticate(pw, hash) {
		if(bcrypt.compare(pw, hash)) {
			// Passwords Match Yay
			console.log("passwords match yay");
		}	
		else {
			// You Suck
			console.log("you suck");
		}
	}
}

module.exports = Security;

// app.use(function *(next) {
// 	var what = yield Security.encrypt;
// 	console.log('WHAT');
// 	console.log(what);
// 	yield next;
// 	yield next;
// });

// var jwtCheck = jwt({
//     secret: new Buffer('m0EXWjlZMw59tcPy25scaxzPCeRuPXsSjCfvfpnZdRD5WypDzxgzgNMhSaNGpfns', 'base64'),
//     audience: 'OG6DrrkHSAHWxg0I5HwjSn231f2rVrb8'
//   });

// // Custom 401 Handling
// app.use(function *(next) {
// 	try {
// 		yield next;
// 	} catch (err) {
// 		if (401 == err.status) {
// 			this.status = 401;
// 			this.body = 'Protected resource, use Authorization header to get access\n';
// 		}
// 		else {
// 			throw err;
// 		}
// 	}
// });

// // Unprotected middleware
// app.use(function *(next) {
// 	if (this.url.match(/^\/public/)) {
// 		this.body = 'unprotected\n';
// 	}
// 	else {
// 		yield next;
// 	}
// });

// // Middleware below this line is only reached if JWT token is valid
// app.use(jwtCheck);

// // Protected middleware
// app.use(function *(){
//   if (this.url.match(/^\/api/)) {
//     this.body = 'protected\n';
//   }
// });