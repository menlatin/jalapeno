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
var publicKey = fs.readFileSync('api/v1/auth/ssl/demo.rsa.pub');

var testData = require('./data_test_admin.js');

var deleteAdmin = function * (testAdmin) {
    // Deep clone test admin reference
    var admin = _.clone(testAdmin, true);
    return test.db.admin_delete_by_username(admin.username);
};

var createAdmin = function * (testAdmin) {
    // Deep clone test admin reference
    var admin = _.clone(testAdmin, true);

    var salt = yield bcrypt.genSalt(10);
    var hash = yield bcrypt.hash(admin.password, salt);

    // Delete password key/value from post object, replace w/hash
    delete admin.password;
    admin.hash = hash;

    // Add automatic date fields
    var now = new Date();
    admin.created_on = now;
    admin.updated_on = now;
    admin.login_on = "";

    return test.db.admin_create(admin);
}

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
        test.expect(response.affected).to.exist;
        test.expect(response.affected).to.be.within(0, 1);
        test.expect(response.ids).to.exist;
        test.expect(response.ids).to.be.an('array');
        test.expect(response.ids).to.have.length(response.affected);
    }
}

var checkAdminData = function(data) {
    test.expect(data).to.be.an('object');
    test.expect(data.id).to.exist;
    test.expect(data.username).to.not.equal('');
    test.expect(data.email).to.not.equal('');
    test.expect(data.created_on).to.exist;
    test.expect(data.updated_on).to_exist;
    test.expect(data.login_on).to.equal('');
}

var checkAdminErrors = function(errors) {
    test.expect(errors, "Errors in response:\n" + printErrors(errors)).to.not.exist;
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

// var postAdmin = function(testAdmin) {
//     // co(function * () {
//     it('should create valid and unique admin for username = ' + testAdmin.username, function * () {

//         // Deep clone test admin reference
//         var admin = _.clone(testAdmin, true);
//         var response = yield test.request.post('/api/v1/admin').send(admin).expect(200).end();
//         checkAdminErrors(response.body.errors);
//         checkAdminData(response.body.data);
//         // Check For Uniqueness
//         // console.log("DID I GET HERE? = ", response.body);

//         var uniqueUsername = yield test.db.admin_by_username(response.body.data.username);
//         console.log('uniqeU = ', uniqueUsername);
//         expect(uniqueUsername.success).to.equal(true);
//         checkAdminData(uniqueUsername.data);

//         var uniqueEmail = yield test.db.admin_by_email(response.body.data.email);
//         expect(uniqueEmail.success).to.equal(true);
//         checkAdminData(uniqueEmail.data);
//     });
// }

var createBaseline = co.wrap(function * (baseline) {
    var creates = [];
    for (var index in baseline) {
        var admin = baseline[index];
        var create = yield * createAdmin(admin);
        creates.push(create);
    }
    return yield Promise.all(creates);
});

var deleteBaseline = co.wrap(function * (baseline) {
    var deletes = [];
    for (var admin in baseline) {
        var del = yield * deleteAdmin(baseline[admin]);
        deletes.push(del);
    }
    return yield Promise.all(deletes);
});

var authAdmin = function(t) {
    it('should ' + t.should, function * () {
        var response = yield test.request.post(t.endpoint).send(t.payload).expect(t.expect).end();

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
    it('should ' + t.should, function * () {
        var response = yield test.request.post(t.endpoint).send(t.payload).expect(t.expect).end();

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


/* 
	   API Endpoint Tests for Admin
*/
describe('Admin Authentication Tests', function() {
    before(function(done) {
        console.log("\t1. baselining db");
        deleteBaseline(testData.auth.baseline).
        then(
            deleteResponses => {
                checkAdminDelete(deleteResponses);
                return createBaseline(testData.auth.baseline);
            },
            error => {
                return createBaseline(testData.auth.baseline);
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
    _.forEach(testData.auth.tests, authAdmin);
});

describe('Admin POST Tests', function() {
    before(function(done) {
        console.log("\t1. baselining db");
        // Deep clone baseline so we can delete zombie node
        // from last positive POST case run
        var baselinePlusZombie = _.clone(testData.post.baseline, true);
        baselinePlusZombie.push(testData.post.tests[0].payload);

        deleteBaseline(baselinePlusZombie).
        then(
            deleteResponses => {
                checkAdminDelete(deleteResponses);
                return createBaseline(testData.post.baseline);
            },
            error => {
                return createBaseline(testData.post.baseline);
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
    _.forEach(testData.post.tests, postAdmin);


    // describe('POST /api/v1/auth/admin', function() {

    // describe('POST /api/v1/admin', function() {
    //     it('should create valid and unique admin objects', function * () {
    //         _.forEach(testAdminArray, postAdmin);
    //     });
    // });

    // describe('GET /api/v1/admin', function() {

    //     var adminLogin = {
    //         username: "test_admin",
    //         password: "test_admin_password1"
    //     };

    //     it('should expect valid authorization header', function * () {
    //         var response = yield test.request.get('/api/v1/admin').expect(401).end();
    //     });

    //     it('should return admin list w/valid authorization header', function * () {
    //         var responseLogin = yield test.request.post('/api/v1/auth/admin').send(adminLogin).end();
    //         test.checkErrors(responseLogin);
    //         var testToken = test.verifyAdminToken(responseLogin);
    //         var authorizationHeader = {
    //             Authorization: "Bearer " + testToken
    //         };
    //         response = yield test.request.get('/api/v1/admin').set(authorizationHeader).end();
    //         test.checkErrors(response);
    //         test.expect(response.status, "Authorization Bearer should be valid.").to.not.equal(401);
    //         test.expect(response.body.data).to.exist;
    //         test.expect(response.body.data).to.be.an('array');
    //         // TODO: Constrain Limits of Response Array?
    //         // test.expect(response.body.data).to.have.length.within(0,1000); 
    //     });
    // });

    // describe('GET /api/v1/admin/:id', function() {

    //     var adminLogin = {
    //         username: "test_admin",
    //         password: "test_admin_password1"
    //     };

    //     it('should expect valid authorization header', function * () {
    //         var response = yield test.request.get('/api/v1/admin/' + adminLogin.username).expect(401).end();
    //     });

    //     it('should return admin object w/valid authorization header', function * () {
    //         var responseLogin = yield test.request.post('/api/v1/auth/admin').send(adminLogin).end();
    //         test.checkErrors(responseLogin);
    //         var testToken = test.verifyAdminToken(responseLogin);
    //         var authorizationHeader = {
    //             Authorization: "Bearer " + testToken
    //         };
    //         response = yield test.request.get('/api/v1/admin/' + adminLogin.username).set(authorizationHeader).end();
    //         test.checkErrors(response);
    //         test.expect(response.status, "Authorization Bearer should be valid.").to.not.equal(401);
    //         test.expect(response.body.data).to.exist;
    //         test.expect(response.body.data).to.be.an('array');
    //         test.expect(response.body.data).to.have.length(1);



    //         //     var resultsUsername = yield test.db.admin_by_username(admin.username);
    //         //     test.expect(resultsUsername.length).to.equal(1);
    //         // var existingAdmin = response.body.data[0];

    //         // TODO: Constrain Limits of Response Array?
    //         // test.expect(response.body.data).to.have.length.within(0,1000); 
    //     });

    // });

    // describe('PUT /api/v1/admin', function() {

    //     var adminUpdate = {
    //         phone: "1234567890"
    //     };

    //     var adminUpdateInvalid = {
    //         phonez: "5555555555"
    //     };

    //     it('should expect valid authorization header', function * () {
    //         var response = yield test.request.get('/api/v1/admin').expect(401).end();
    //     });

    //     it('should expect value to be modified in DB');
    //     it('should fail for invalid key');
    //     it('should fail for invalid value');

    // });

});