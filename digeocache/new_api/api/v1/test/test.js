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

var _ = require('lodash');
var request = require('co-supertest').agent(app.listen());

var expect = require('chai').expect;
var assert = require('chai').assert;

var test = {
    app: app,
    db: DB,
    request: request,
    expect: expect,
    assert: assert,
    expectErrors: function(errors, expected) {
        expect(errors, "Expected error to exist in response, but none found!").to.exist;
        expect(errors, "Error in response should always be an array.").to.be.an('array');
        expect(errors, "Expected errors in test data should be an array.").to.be.an('array');
        expected.forEach(function(expectedError) {
            var found = _.findWhere(errors, {
                code: expectedError.code
            });
            expect(found, "Expected error code " + expectedError.code + "(" + expectedError.message + ")").to.not.be.undefined;
        });
    }
};

module.exports = test;