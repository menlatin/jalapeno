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

module.exports = function APIv1(jwt, publicKey, operations, admin, user, geocache, error_pages) {

	var Router = require('koa-router');
	var router = new Router();

	var operations  = require('./Operations.js')();
	var verifyJWT = jwt({ secret: publicKey, algorithm: 'RS256' });

	// var publicRouter = new Router();
	// var protectedRouter = new Router();

	/* Admin API REST Routes ------------------------------------------------------*/
	router.post('/'+operations.ADMINS, admin.post);					// Request New Admin
	router.get('/'+operations.ADMINS, verifyJWT, admin.get);						// Request Admin List
	router.put('/'+operations.ADMINS, verifyJWT, admin.put);						// Request Bulk Admin Update
	router.del('/'+operations.ADMINS, verifyJWT, admin.del);						// Request Bulk Delete Admin
	router.post('/'+operations.ADMINS+'/:id', error_pages.generic);	// Error, N/A
	router.get('/'+operations.ADMINS+'/:id', verifyJWT, admin.get);				// Request Admin w/ID
	router.put('/'+operations.ADMINS+'/:id', verifyJWT, admin.put);				// Request Admin Update w/ID
	router.del('/'+operations.ADMINS+'/:id', verifyJWT, admin.del);				// Request Delete Admin w/ID

	/* User API REST Routes -------------------------------------------------------*/
	router.post('/'+operations.USERS, user.post);							// Request New User
	router.get('/'+operations.USERS, verifyJWT, user.get);						// Requeset User List
	router.put('/'+operations.USERS, verifyJWT, user.put);						// Request Bulk User Update
	router.del('/'+operations.USERS, verifyJWT, user.del);						// Request Bulk Delete Admin
	router.post('/'+operations.USERS+'/:id', error_pages.generic);		// Error, N/A
	router.get('/'+operations.USERS+'/:id', verifyJWT, user.get);					// Request User w/ID
	router.put('/'+operations.USERS+'/:id', verifyJWT, user.put);					// Request User Update w/ID
	router.del('/'+operations.USERS+'/:id', verifyJWT, user.del);					// Request Delete User w/ID

	/* Geocache API REST Routes ---------------------------------------------------*/ 
	router.post('/'+operations.GEOCACHES, verifyJWT, geocache.post);				// Request New Geocache
	router.get('/'+operations.GEOCACHES, verifyJWT, geocache.get);				// Request Geocache List
	router.put('/'+operations.GEOCACHES, verifyJWT, geocache.put);				// Request Bulk Geocache Update
	router.del('/'+operations.GEOCACHES, verifyJWT, geocache.del);				// Request Bulk Delete Geocache
	router.post('/'+operations.GEOCACHES+'/:id', error_pages.generic);	// Error, N/A
	router.get('/'+operations.GEOCACHES+'/:id', verifyJWT, geocache.get);			// Request Geocache w/ID
	router.put('/'+operations.GEOCACHES+'/:id', verifyJWT, geocache.put);			// Request Geocache Update w/ID
	router.del('/'+operations.GEOCACHES+'/:id', verifyJWT, geocache.del);			// Request Delete Geocache w/ID

	// var router = {
	// 	public: publicRouter,
	// 	protected: protectedRouter
	// }

	return router;
}