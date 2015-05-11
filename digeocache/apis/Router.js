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

module.exports = function Router(jwt, publicKey, operations, login_pages, login, admin_pages, user_pages, geocache_pages) {

	var Router = require('koa-router');
	var router = new Router();

	var operations  = require('./Operations.js')();
	var verifyJWT = jwt({ secret: publicKey, algorithm: 'RS256' });

	var haha = function *(next) {
		console.log("this is real");
	}

	// var publicRouter = new Router();
	// var protectedRouter = new Router();

	/* Admin Page Routes ------------------------------------------------------*/ 
	router.get('/login/'+operations.ADMINS, login_pages.admin);
	router.post('/login/'+operations.ADMINS, login.postAdmin);
	router.get('/'+operations.ADMINS+'/create', verifyJWT, haha, admin_pages.create);			// Admin Entity Creation Form
	router.get('/'+operations.ADMINS+'/edit', verifyJWT, haha, admin_pages.edit);				// Admin Entity Modification Form
	router.get('/'+operations.ADMINS+'/destroy', verifyJWT, haha, admin_pages.destroy);			// Admin Entity Destruction Form
	router.get('/'+operations.ADMINS, verifyJWT, haha, admin_pages.view);						// Admin Superview

	/* User Page Routes -------------------------------------------------------*/
	router.get('/login/', login_pages.user);
	router.get('/login/'+operations.USERS, login_pages.user);
	router.post('/login/'+operations.USERS, login.postUser);
	router.get('/'+operations.USERS+'/register', user_pages.register);			// Register As A New User Form
	router.get('/'+operations.USERS+'/profile', verifyJWT, user_pages.profile);			// Show Authenticated User Profile
	router.get('/'+operations.USERS+'/profile/:username', verifyJWT, user_pages.profile);	// Show User Profile w/username
	router.get('/'+operations.USERS+'/edit', verifyJWT, user_pages.edit);					// Edit Authenticated User Profile
	router.get('/'+operations.USERS+'/cancel', verifyJWT, user_pages.cancel);				// Cancel Authenticated User Account
	router.get('/'+operations.USERS, verifyJWT, user_pages.list);							// Index of Users

	/* Geocache Page Routes ---------------------------------------------------*/ 
	router.get('/'+operations.GEOCACHES+'/drop', verifyJWT, geocache_pages.drop);			// Drop Geocache Form
	router.get('/'+operations.GEOCACHES+'/collect', verifyJWT, geocache_pages.collect);   // Collect Geocache Form
	router.get('/'+operations.GEOCACHES+'/edit', verifyJWT, geocache_pages.edit);			// Edit Geocaches of Authenticated User
	router.get('/'+operations.GEOCACHES+'/remove', verifyJWT, geocache_pages.remove);	    // Remove Geocache Form
	router.get('/'+operations.GEOCACHES+'/:id', verifyJWT, geocache_pages.show);			// Show Geocache w/ID
	router.get('/'+operations.GEOCACHES, verifyJWT, geocache_pages.list);                 // Index of Geocaches

	// var router = {
	// 	public: publicRouter,
	// 	protected: protectedRouter
	// }

	return router;
}