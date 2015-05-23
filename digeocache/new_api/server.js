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

var http = require('http');
var https = require('https');
var fs = require('fs');

var V1 = module.exports = require('./api/v1/V1.js')();

var SSLOptionsV1 = {
    key: fs.readFileSync('api/v1/auth/ssl/digeocache-key.pem', 'utf8'),
    cert: fs.readFileSync('api/v1/auth/ssl/digeocache.crt', 'utf8')
}

var port = process.env.PORT || 8000;
var env = process.env.NODE_ENV || 'development';

if (!module.parent) {
    console.log("\n--- Starting App on Port ", port, "---");
    https.createServer(SSLOptionsV1, V1.callback()).listen(port);
} else {
    console.log("\n--- Starting App for Testing ---");
}