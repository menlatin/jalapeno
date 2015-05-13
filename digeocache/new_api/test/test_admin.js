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

/* 
	API Endpoint Tests for Admin
 */
describe('ADMIN TESTS', function() {

    describe('POST /api/v1/admin', function() {

        var admin = {
            username: "test_admin",
            password: "test_admin_password1",
            firstname: "Test",
            lastname: "Admin",
            email: "test_admin@digeocache.com",
            birthday: "1969-12-31T06:00:00.000Z",
            phone: "5558675309"
        };

        it('should create an admin object', function * () {
            // Initial Request May Fail in Error if Test User Lingering in Database
            var response = yield test.request.post('/api/v1/admin').send(admin).end();
            // Delete Any Users in the Database with this Username or Email
            var usernameTaken = false;
            var emailTaken = false;
            if (response.body.errors) {
                var taken = response.body.errors.some(
                    function isTaken(error, index, array) {
                        usernameTaken = error.code == test.errors.user.USERNAME_TAKEN().code;
                        emailTaken = error.code == test.errors.user.EMAIL_TAKEN().code;
                        return (usernameTaken || emailTaken);
                    }
                );

                var dbDeleteCallback = null;
                if (usernameTaken) {
                    dbDeleteCallback = test.db.util.admin_delete_by_username(admin.username);
                } else if (emailTaken) {
                    dbDeleteCallback = test.db.util.admin_delete_by_email(admin.email);
                }
                var results = yield dbDeleteCallback;

                // Try Again After Deleting Zombie Test Admin
                test.expect(!results).to.equal(false);
                response = yield test.request.post('/api/v1/admin').send(admin).expect(200).end();
            }

            test.expect(response.body.errors).to.not.exist;
            test.expect(response.body.data.length).to.equal(1);

            var data = response.body.data[0];

            test.expect(data.id).to.exist;
            test.expect(data.username).to.not.equal('');
            test.expect(data.email).to.not.equal('');
            test.expect(data.created_on).to.exist;
            test.expect(data.updated_on).to_exist;
            test.expect(data.login_on).to.equal('');
        });

        it('should expect username and email to be unique in DB', function * () {
            var dbAdminsWithUsernameCallback = test.db.util.admin_by_username(admin.username);
            var dbAdminsWithEmailCallback = test.db.util.admin_by_email(admin.email);
            var resultsUsername = yield dbAdminsWithUsernameCallback;
            var resultsEmail = yield dbAdminsWithEmailCallback;
            test.expect(resultsUsername.length).to.equal(1);
            test.expect(resultsEmail.length).to.equal(1);
        });


    });

    describe('GET /api/v1/admin', function() {

        var adminLogin = {
            username: "test_admin",
            password: "test_admin_password1"
        };

        it('should expect authorization header', function * () {
            var response = yield test.request.get('/api/v1/admin').expect(401).end();
        });

        it('should authenticate with valid username/password', function * () {
            var response = yield test.request.post('/api/v1/auth/admin').send(adminLogin).end();
            test.checkErrors(response);
            test.verifyToken(response);
        });

        it('should authenticate with valid email/password', function * () {
            // Use email in place of username ("@" should be auto-detected and validated as email)
            adminLogin.username = "test_admin@digeocache.com";
            var response = yield test.request.post('/api/v1/auth/admin').send(adminLogin).end();
            test.checkErrors(response);
            test.verifyToken(response);
        });

        it('should fail authentication with incorrect password', function * () {
            adminLogin.password = "Hello4321";
            var response = yield test.request.post('/api/v1/auth/admin').send(adminLogin).end();
            test.expectErrors(response, [test.errors.login.PASSWORD_INCORRECT('password')]);
        });

        it('should fail authentication with invalid username and password', function * () {
            adminLogin.username = "invali^U$eNam[";
            adminLogin.password = "~";
            var response = yield test.request.post('/api/v1/auth/admin').send(adminLogin).end();
            test.expectErrors(response, [test.errors.user.USERNAME_INVALID('username'), test.errors.user.PASSWORD_INVALID('password')]);
        });
    });



});