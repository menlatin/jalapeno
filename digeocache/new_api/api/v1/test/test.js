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

var app = require('../../../server.js');

var DB = require('../Database.js')('http://localhost:7474');

var Errors = require('../Errors.js');
var errors = new Errors();

var _ = require('lodash');
var Q = require('q');
var request = require('co-supertest').agent(app.listen());
var expect = require('chai').expect;
var assert = require('chai').assert;
var jwt = require('koa-jwt');
var fs = require('fs');
var bcrypt = require('co-bcrypt');

// Public Key Used for JWT Verification
var publicKey = fs.readFileSync('api/v1/auth/ssl/demo.rsa.pub');

var test = {
    app: app,
    db: DB,
    errors: errors,
    bcrypt: bcrypt,
    Q: Q,
    request: request,
    expect: expect,
    assert: assert,
    jwt: jwt,
    fs: fs,
    publicKey: publicKey,
    printErrors: function(errors) {
        if (errors) {
            return JSON.stringify(errors, null, '\t') + "\n";
        }
    },
    checkData: function(data) {
        test.expect(data).to.be.an('object');
        test.expect(data.id).to.exist;
        test.expect(data.username).to.not.equal('');
        test.expect(data.email).to.not.equal('');
        test.expect(data.created_on).to.exist;
        test.expect(data.updated_on).to_exist;
        test.expect(data.login_on).to.equal('');
    },
    checkErrors: function(errors) {
        console.log("WHAT!!!!SDFSDFDS = ", errors);
        expect(errors).to.not.exist;
        console.log("WHAT!!!!");
        expect(errors, "Errors in response:\n" + test.printErrors(errors)).to.not.exist;

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
    verifyAdminToken: function(response) {
        expect(response.body.data.length).to.equal(1);
        var data = response.body.data[0];
        expect(data.token).to.exist;
        // verify a token symmetric - synchronous
        var decoded = jwt.verify(data.token, publicKey);
        expect(decoded.username).to.exist; // expect "username" in token claim
        expect(decoded.admin).to.be.true; // expect "admin" in token claim to be true
        expect(decoded.iat).to.exist; // expect "issued-at" timestamp in token claim
        expect(decoded.exp).to.exist; // expect "expiration" timestamp in token claim
        return data.token;
    },
    verifyUserToken: function(data) {
        console.log("VERIFY TOKEN DATA =", data);
        expect(data).to.equal(1);
        var data = response.body.data[0];
        expect(data.token).to.exist;
        // verify a token symmetric - synchronous
        var decoded = jwt.verify(data.token, publicKey);
        expect(decoded.username).to.exist; // expect "username" in token claim
        expect(decoded.admin).to.be.false; // expect "admin" in token claim to be false
        expect(decoded.iat).to.exist; // expect "issued-at" timestamp in token claim
        expect(decoded.exp).to.exist; // expect "expiration" timestamp in token claim
        return data.token;
    }
};

module.exports = test;