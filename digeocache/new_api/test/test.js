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

var app = require('../server.js');

var Database = require('../Database.js');
var Errors = require('../Errors.js');

var db = new Database('http://localhost:7474');
var errors = new Errors();

var _ = require('lodash');
var request = require('co-supertest').agent(app.listen());
var expect = require('chai').expect;
var assert = require('chai').assert;
var jwt = require('koa-jwt');
var fs = require('fs');

// Public Key Used for JWT Verification
var publicKey = fs.readFileSync('ssl/demo.rsa.pub');

var test = {
    app: app,
    db: db,
    errors: errors,
    _: _,
    request: request,
    expect: expect,
    assert: assert,
    jwt: jwt,
    fs: fs,
    publicKey: publicKey,
    printErrors: function(response) {
        if (response.body.errors) {
            return JSON.stringify(response.body.errors, null, '\t') + "\n";
        }
    },
    checkErrors: function(response) {
        expect(response.body.errors, "Errors in response:\n" + test.printErrors(response)).to.not.exist;

    },
    expectErrors: function(response, expected) {
        expect(response.body.errors, "Expected error to exist in response, but none found!").to.exist;
        expected.forEach(function(expectedError) {
            var found = _.findWhere(response.body.errors, {
                code: expectedError.code
            });
            expect(found, "Expected error code " + expectedError.code + "(" + expectedError.message + ")").to.not.be.undefined;
        });
    },
    verifyToken: function(response) {
        expect(response.body.data.length).to.equal(1);
        var data = response.body.data[0];
        expect(data.token).to.exist;
        // verify a token symmetric - synchronous
        var decoded = jwt.verify(data.token, publicKey);
        expect(decoded.username).to.exist; // expect "username" saved at token signing to exist in decoded token
        expect(decoded.iat).to.exist; // expect "issued-at" iat timestamp to exist in decoded token
        expect(decoded.exp).to.exist; // expect "expiration" exp timestamp to exist in decoded token
    }
};

module.exports = test;