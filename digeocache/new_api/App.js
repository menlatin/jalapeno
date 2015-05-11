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

module.exports = function App() {
	var path = require('path');
	var koa = require('koa');
	// var forceSSL = require('koa-force-ssl');
	var logger = require('koa-logger');
	// var userAgent = require('koa-useragent');
	var staticCache = require('koa-static-cache');
	
	var app = koa();

	app.use(logger());
	// app.use(userAgent());

	// Make Static Content Available in 'public' Folder
	var options = {
		dir: path.join(__dirname, '/public'),
		maxAge: 60*60*24*365,
		cacheControl: "",
		buffer: true,
		gzip: true,
		alias: {},
		prefix: "/public",
		dynamic: true
	};

	var files = {};

	app.use(staticCache(path.join(__dirname, '/public'), options, files));
	
	return app;
};