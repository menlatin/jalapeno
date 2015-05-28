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

var test = require('./test.js');

var _ = require('lodash');
var co = require('co');
var bcrypt = require('co-bcrypt');
var jwt = require('koa-jwt');
var fs = require('fs');

// Public Key Used for JWT Verification
var publicKey = fs.readFileSync('v1/auth/ssl/demo.rsa.pub');

var testAdminData = require('./data_test_admin.js');

var printErrors = function(errors) {
    if (errors) {
        return JSON.stringify(errors, null, '\t') + "\n";
    } else {
        return "no errors found";
    }
}

var checkAdminCreate = function(createResponses) {
    test.expect(createResponses).to.be.an('array');
    for (var index in createResponses) {
        var response = createResponses[index];
        test.expect(response.success).to.exist;
        test.expect(response.success).to.equal(true);
        checkAdminData(response.data);
    }
}

var checkAdminDelete = function(deleteResponses) {
    test.expect(deleteResponses).to.be.an('array');
    for (var index in deleteResponses) {
        var response = deleteResponses[index];
        test.expect(response.success).to.exist;
        test.expect(response.success).to.equal(true);
        checkAdminDeleteData(response.data);
    }
}

var checkAdminData = function(data) {
    if (_.isArray(data)) {
        for (var index in data) {
            test.expect(data[index].id).to.exist;
            test.expect(data[index].username).to.not.equal('');
            test.expect(data[index].email).to.not.equal('');
            test.expect(data[index].created_on).to.exist;
            test.expect(data[index].updated_on).to_exist;
            test.expect(data[index].login_on).to.exist;
        }
    } else {
        test.expect(data.id).to.exist;
        test.expect(data.username).to.not.equal('');
        test.expect(data.email).to.not.equal('');
        test.expect(data.created_on).to.exist;
        test.expect(data.updated_on).to_exist;
        test.expect(data.login_on).to.exist;
    }
}

var checkAdminDeleteData = function(data) {
    test.expect(data).to.exist;
    test.expect(data).to.be.an('object');
    test.expect(data.affected).to.exist;
    test.expect(data.affected).to.be.within(0, 1);
    test.expect(data.ids).to.exist;
    test.expect(data.ids).to.be.an('array');
    test.expect(data.ids).to.have.length(data.affected);
}

var checkAdminErrors = function(errors) {
    test.expect(errors, "Errors in response:\n" + (errors ? printErrors(errors) : "")).to.not.exist;
}

var verifyAdminToken = function(data) {
    test.expect(data).to.be.an('object');
    test.expect(data.token).to.exist;
    test.expect(data.token).to.not.equal('');
    // verify a token symmetric - synchronous
    var decoded = jwt.verify(data.token, publicKey);
    test.expect(decoded.username).to.exist; // expect "username" in token claim
    test.expect(decoded.admin).to.be.true; // expect "admin" in token claim to be true
    test.expect(decoded.iat).to.exist; // expect "issued-at" timestamp in token claim
    test.expect(decoded.exp).to.exist; // expect "expiration" timestamp in token claim
    return data.token;
}

var authAdmin = function(t) {
    it(t.endpoint + ' => should ' + t.should, function * () {
        var response = yield test.request.post(t.endpoint).send(t.credentials).expect(t.expect).end();

        // Positive Test Case Expects No Errors
        if (t.errors == undefined) {
            checkAdminErrors(response.body.errors);
            verifyAdminToken(response.body.data);
        }
        // Negative Test Cases Looking For Specific Errors
        else {
            test.expectErrors(response.body.errors, t.errors);
        }
    });
}

var postAdmin = function(t) {
    it(t.endpoint + ' => should ' + t.should, function * () {
        var response = undefined;
        // Credentials Provided to Access Resource
        if (t.credentials) {
            var responseAuth = yield test.request.post("/api/v1/auth/admin").send(t.credentials).expect(t.expect).end();
            checkAdminErrors(responseAuth.body.errors);
            var testToken = verifyAdminToken(responseAuth.body.data);
            var authorizationHeader = {
                Authorization: "Bearer " + testToken
            };
            response = yield test.request.post(t.endpoint).set(authorizationHeader).send(t.payload).expect(t.expect).end();
        } else {
            response = yield test.request.post(t.endpoint).send(t.payload).expect(t.expect).end();
        }

        // Positive Test Case Expects No Errors
        if (t.errors == undefined) {
            checkAdminErrors(response.body.errors);
            checkAdminData(response.body.data);
        }
        // Negative Test Cases Looking For Specific Errors
        else {
            test.expectErrors(response.body.errors, t.errors);
        }
    });
}

var getAdmin = function(t) {
    it(t.endpoint + ' => should ' + t.should, function * () {
        // Check for wildcard :id in endpoint for tests using id in URL
        var modifiedEndpoint = _.clone(t.endpoint, true);
        var pathArray = modifiedEndpoint.split('/');
        if (_.includes(pathArray, ":id")) {
            // Get the first baseline data item's ID
            var userToFind = testAdminData.get.baseline[0].admin.username;
            var findUsername = yield test.db.admin_by_username(userToFind);
            test.expect(findUsername.success).to.equal(true);
            checkAdminData(findUsername.data);
            test.expect(findUsername.data).to.be.an('object');
            modifiedEndpoint = modifiedEndpoint.replace(":id", findUsername.data.id);
        }

        var response = undefined;
        // Credentials Provided to Access Resource
        if (t.credentials) {
            var responseAuth = yield test.request.post("/api/v1/auth/admin").send(t.credentials).expect(t.expect).end();
            checkAdminErrors(responseAuth.body.errors);
            var testToken = verifyAdminToken(responseAuth.body.data);
            var authorizationHeader = {
                Authorization: "Bearer " + testToken
            };
            response = yield test.request.get(modifiedEndpoint).set(authorizationHeader).expect(t.expect).end();
        } else {
            response = yield test.request.get(modifiedEndpoint).expect(t.expect).end();
        }

        // Positive Test Case Expects No Errors
        if (t.errors == undefined) {
            checkAdminErrors(response.body.errors);
            checkAdminData(response.body.data);
        }
        // Negative Test Cases Looking For Specific Errors
        else {
            test.expectErrors(response.body.errors, t.errors);
        }
    });
}

var putAdmin = function(t) {
    it(t.endpoint + ' => should ' + t.should, function * () {
        // Check for wildcard :id in endpoint for tests using id in URL
        var modifiedEndpoint = _.clone(t.endpoint, true);
        var pathArray = modifiedEndpoint.split('/');
        if (_.includes(pathArray, ":id")) {
            // Get the first baseline data item's ID
            var userToFind = testAdminData.put.baseline[0].admin.username;
            var findUsername = yield test.db.admin_by_username(userToFind);
            test.expect(findUsername.success).to.equal(true);
            checkAdminData(findUsername.data);
            test.expect(findUsername.data).to.be.an('object');
            modifiedEndpoint = modifiedEndpoint.replace(":id", findUsername.data.id);
        }

        var response = undefined;
        // Credentials Provided to Access Resource
        if (t.credentials) {
            var responseAuth = yield test.request.post("/api/v1/auth/admin").send(t.credentials).send(t.payload).expect(t.expect).end();
            checkAdminErrors(responseAuth.body.errors);
            var testToken = verifyAdminToken(responseAuth.body.data);
            var authorizationHeader = {
                Authorization: "Bearer " + testToken
            };
            response = yield test.request.put(modifiedEndpoint).set(authorizationHeader).send(t.payload).expect(t.expect).end();
        } else {
            response = yield test.request.put(modifiedEndpoint).expect(t.expect).end();
        }

        // Positive Test Case Expects No Errors
        if (t.errors == undefined) {
            checkAdminErrors(response.body.errors);
            checkAdminData(response.body.data);
        }
        // Negative Test Cases Looking For Specific Errors
        else {
            test.expectErrors(response.body.errors, t.errors);
        }
    });
}

var delAdmin = function(t) {
    it(t.endpoint + ' => should ' + t.should, function * () {
        // Check for wildcard :id in endpoint for tests using id in URL
        var modifiedEndpoint = _.clone(t.endpoint, true);
        var pathArray = modifiedEndpoint.split('/');
        if (_.includes(pathArray, ":id")) {
            // Get the first baseline data item's ID
            var userToFind = testAdminData.del.baseline[0].admin.username;
            var findUsername = yield test.db.admin_by_username(userToFind);
            test.expect(findUsername.success).to.equal(true);
            checkAdminData(findUsername.data);
            test.expect(findUsername.data).to.be.an('object');
            modifiedEndpoint = modifiedEndpoint.replace(":id", findUsername.data.id);
        }

        var response = undefined;
        // Credentials Provided to Access Resource
        if (t.credentials) {
            var responseAuth = yield test.request.post("/api/v1/auth/admin").send(t.credentials).expect(t.expect).end();
            checkAdminErrors(responseAuth.body.errors);
            var testToken = verifyAdminToken(responseAuth.body.data);
            var authorizationHeader = {
                Authorization: "Bearer " + testToken
            };
            response = yield test.request.del(modifiedEndpoint).set(authorizationHeader).send({}).expect(t.expect).end();
        } else {
            response = yield test.request.del(modifiedEndpoint).send({}).expect(t.expect).end();
        }

        // Positive Test Case Expects No Errors
        if (t.errors == undefined) {
            checkAdminErrors(response.body.errors);
            checkAdminDeleteData(response.body.data);
        }
        // Negative Test Cases Looking For Specific Errors
        else {
            test.expectErrors(response.body.errors, t.errors);
        }
    });
}

/* 
	   API Endpoint Tests for Admin
*/
describe('Admin Authentication Tests => /api/v1/auth/admin', function() {
    before(function(done) {
        console.log("\t1. baselining db");
        deleteAdminBaseline(testAdminData.auth.baseline).
        then(
            deleteResponses => {
                checkAdminDelete(deleteResponses);
                return createAdminBaseline(testAdminData.auth.baseline);
            },
            error => {
                return createAdminBaseline(testAdminData.auth.baseline);
            }
        ).then(
            createResponses => {
                checkAdminCreate(createResponses);
                console.log("\t2. successfully created baseline");
                done();
            },
            error => {
                checkAdminErrors(error);
                console.log("\t2. * errors creating new baseline");
                done();
            }
        );
    });

    // Authentication "shoulds" Magic
    _.forEach(testAdminData.auth.tests, authAdmin);
});

describe('Admin POST Tests => /api/v1/admin', function() {
    before(function(done) {
        console.log("\t1. baselining db");

        // Deep clone baseline so we can delete zombie node
        // from last positive POST case run
        var baselinePlusZombieAdmin = _.clone(testAdminData.post.baseline, true);
        baselinePlusZombieAdmin.push({
            admin: testAdminData.post.tests[0].payload
        });

        deleteAdminBaseline(baselinePlusZombieAdmin).
        then(
            deleteResponses => {
                checkAdminDelete(deleteResponses);
                return createAdminBaseline(testAdminData.post.baseline);
            },
            error => {
                return createAdminBaseline(testAdminData.post.baseline);
            }
        ).then(
            createResponses => {
                checkAdminCreate(createResponses);
                console.log("\t2. successfully created baseline");
                done();
            },
            error => {
                checkAdminErrors(error);
                console.log("\t2. * errors creating new baseline");
                done();
            }
        );
    });

    // POST "shoulds" Magic
    _.forEach(testAdminData.post.tests, postAdmin);
});

describe('Admin GET Tests => /api/v1/admin', function() {
    before(function(done) {
        console.log("\t1. baselining db");
        deleteAdminBaseline(testAdminData.get.baseline).
        then(
            deleteResponses => {
                checkAdminDelete(deleteResponses);
                return createAdminBaseline(testAdminData.get.baseline);
            },
            error => {
                return createAdminBaseline(testAdminData.get.baseline);
            }
        ).then(
            createResponses => {
                checkAdminCreate(createResponses);
                console.log("\t2. successfully created baseline");
                done();
            },
            error => {
                checkAdminErrors(error);
                console.log("\t2. * errors creating new baseline");
                done();
            }
        );
    });

    // GET "shoulds" Magic
    _.forEach(testAdminData.get.tests, getAdmin);
});

describe('Admin PUT Tests => /api/v1/admin', function() {
    before(function(done) {
        console.log("\t1. baselining db");
        deleteAdminBaseline(testAdminData.put.baseline).
        then(
            deleteResponses => {
                checkAdminDelete(deleteResponses);
                return createAdminBaseline(testAdminData.put.baseline);
            },
            error => {
                return createAdminBaseline(testAdminData.put.baseline);
            }
        ).then(
            createResponses => {
                checkAdminCreate(createResponses);
                console.log("\t2. successfully created baseline");
                done();
            },
            error => {
                checkAdminErrors(error);
                console.log("\t2. * errors creating new baseline");
                done();
            }
        );
    });

    // PUT "shoulds" Magic
    _.forEach(testAdminData.put.tests, putAdmin);
});

describe('Admin DELETE Tests => /api/v1/admin', function() {
    before(function(done) {
        console.log("\t1. baselining db");
        deleteAdminBaseline(testAdminData.del.baseline).
        then(
            deleteResponses => {
                checkAdminDelete(deleteResponses);
                return createAdminBaseline(testAdminData.del.baseline);
            },
            error => {
                return createAdminBaseline(testAdminData.del.baseline);
            }
        ).then(
            createResponses => {
                checkAdminCreate(createResponses);
                console.log("\t2. successfully created baseline");
                done();
            },
            error => {
                checkAdminErrors(error);
                console.log("\t2. * errors creating new baseline");
                done();
            }
        );
    });

    // DELETE "shoulds" Magic
    _.forEach(testAdminData.del.tests, delAdmin);
});

var createAdminBaseline = co.wrap(function * (baseline) {
    var creates = [];
    for (var index in baseline) {
        var admin = baseline[index].admin;
        var create = yield * test.createAdmin(admin);
        creates.push(create);
    }
    return yield Promise.all(creates);
});

var deleteAdminBaseline = co.wrap(function * (baseline) {
    var deletes = [];
    for (var index in baseline) {
        var admin = baseline[index].admin;
        var del = yield * test.deleteAdmin(admin);
        deletes.push(del);
    }
    return yield Promise.all(deletes);
});