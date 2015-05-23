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

var testAdminArray = require('./data_test_admin.js');

var cleanAdmin = function(testAdmin) {
    co(function * () {
        // Deep clone test admin reference
        var admin = _.clone(testAdmin, true);

        var del = yield test.db.admin_delete_by_username(admin.username);;
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

        var created = yield test.db.admin_create(admin);
    });
}

var authenticateAdmin = function(testAdmin) {
    co(function * () {
        // Deep clone test admin reference
        var admin = _.clone(testAdmin, true);
        var login = {
            username: admin.username,
            password: admin.password
        }
        var response = yield test.request.post('/api/v1/auth/admin').send(login).expect(200).end();
        test.checkErrors(response.body.errors);
        test.verifyAdminToken(response.body.data);
    });
}

var postAdmin = function(testAdmin) {
    co(function * () {
        // Deep clone test admin reference
        var admin = _.clone(testAdmin, true);
        var response = yield test.request.post('/api/v1/admin').send(admin).expect(200).end();
        test.checkErrors(response.body.errors);
        test.checkData(response.body.data);
        // Check For Uniqueness
                                // console.log("DID I GET HERE? = ", response.body);

        var uniqueUsername = yield test.db.admin_by_username(response.body.data.username);
        console.log('uniqeU = ', uniqueUsername);
        test.expect(uniqueUsername.success).to.equal(true);
        test.checkData(uniqueUsername.data);

        var uniqueEmail = yield test.db.admin_by_email(response.body.data.email);
        test.expect(uniqueEmail.success).to.equal(true);
        test.checkData(uniqueEmail.data);
    });
}

/* 
	   API Endpoint Tests for Admin
*/
describe('ADMIN TESTS', function() {

    beforeEach(function(done) {
        _.forEach(testAdminArray, cleanAdmin);
        done();
    });
    afterEach(function(done) {
        _.forEach(testAdminArray, cleanAdmin);
        done();
    });

    describe('POST /api/v1/auth/admin', function() {

        it('should authenticate admins with valid username/password', function * () {
            _.forEach(testAdminArray, authenticateAdmin);
        });

        // it('should authenticate with valid email/password', function * () {
        //     // Use email in place of username ("@" should be auto-detected and validated as email)
        //     adminLogin.username = "test_admin@digeocache.com";
        //     var response = yield test.request.post('/api/v1/auth/admin').send(adminLogin).end();
        //     test.checkErrors(response);
        //     test.verifyAdminToken(response);
        // });

        // it('should fail authentication with incorrect password', function * () {
        //     adminLogin.password = "Hello4321";
        //     var response = yield test.request.post('/api/v1/auth/admin').send(adminLogin).end();
        //     test.expectErrors(response, [test.errors.login.PASSWORD_INCORRECT('password')]);
        // });

        // it('should fail authentication with invalid username and password', function * () {
        //     adminLogin.username = "invali^U$eNam[";
        //     adminLogin.password = "~";
        //     var response = yield test.request.post('/api/v1/auth/admin').send(adminLogin).end();
        //     test.expectErrors(response, [test.errors.user.USERNAME_INVALID('username'), test.errors.user.PASSWORD_INVALID('password')]);
        // });
    });

    describe('POST /api/v1/admin', function() {
        it('should create valid and unique admin objects', function * () {
            _.forEach(testAdminArray, postAdmin);
        });
    });

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