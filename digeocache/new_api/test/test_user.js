// // The MIT License (MIT)

// // Copyright (c) 2015 Elliott Richerson, Carlos Aari Lotfipour

// // Permission is hereby granted, free of charge, to any person obtaining a copy
// // of this software and associated documentation files (the "Software"), to deal
// // in the Software without restriction, including without limitation the rights
// // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// // copies of the Software, and to permit persons to whom the Software is
// // furnished to do so, subject to the following conditions:

// // The above copyright notice and this permission notice shall be included in 
// // all copies or substantial portions of the Software.

// // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// // SOFTWARE.

// var test = require('./test.js');

// /* 
// 	API Endpoint Tests for User
//  */
// describe('USER TESTS', function() {
//     describe('POST /api/v1/auth/user', function() {
//         var userLogin = {
//             username: "test_user",
//             password: "test_user_password1"
//         };

//         it('should authenticate with valid username/password', function * () {
//             var response = yield test.request.post('/api/v1/auth/user').send(userLogin).end();
//             test.checkErrors(response);
//             test.verifyUserToken(response);
//         });

//         it('should authenticate with valid email/password', function * () {
//             // Use email in place of username ("@" should be auto-detected and validated as email)
//             userLogin.username = "test_user@digeocache.com";
//             var response = yield test.request.post('/api/v1/auth/user').send(userLogin).end();
//             test.checkErrors(response);
//             test.verifyUserToken(response);
//         });

//         it('should fail authentication with incorrect password', function * () {
//             userLogin.password = "Hello4321";
//             var response = yield test.request.post('/api/v1/auth/user').send(userLogin).end();
//             test.expectErrors(response, [test.errors.login.PASSWORD_INCORRECT('password')]);
//         });

//         it('should fail authentication with invalid username and password', function * () {
//             userLogin.username = "invali^U$eNam[";
//             userLogin.password = "~";
//             var response = yield test.request.post('/api/v1/auth/user').send(userLogin).end();
//             test.expectErrors(response, [test.errors.user.USERNAME_INVALID('username'), test.errors.user.PASSWORD_INVALID('password')]);
//         });
//     });

//     describe('POST /api/v1/user', function() {

//         var user = {
//             username: "test_user",
//             password: "test_user_password1",
//             firstname: "Test",
//             lastname: "User",
//             email: "test_user@digeocache.com",
//             birthday: "1969-12-31T06:00:00.000Z",
//             phone: "5558675309"
//         };

//         it('should create an user object', function * () {
//             // Initial Request May Fail in Error if Test User Lingering in Database
//             var response = yield test.request.post('/api/v1/user').send(user).end();
//             // Delete Any Users in the Database with this Username or Email
//             var usernameTaken = false;
//             var emailTaken = false;

//             if (response.body.errors) {
//                 var taken = response.body.errors.some(
//                     function isTaken(error, index, array) {
//                         usernameTaken = error.code == test.errors.user.USERNAME_TAKEN().code;
//                         emailTaken = error.code == test.errors.user.EMAIL_TAKEN().code;
//                         return (usernameTaken || emailTaken);
//                     }
//                 );

//                 var dbDeleteCallback = null;
//                 if (usernameTaken) {
//                     dbDeleteCallback = test.db.util.user_delete_by_username(user.username);
//                 } else if (emailTaken) {
//                     dbDeleteCallback = test.db.util.user_delete_by_email(user.email);
//                 }
//                 var results = yield dbDeleteCallback;

//                 // Try Again After Deleting Zombie Test Admin
//                 test.expect(!results).to.equal(false);
//                 response = yield test.request.post('/api/v1/user').send(user).expect(200).end();
//             }

//             test.expect(response.body.errors).to.not.exist;
//             test.expect(response.body.data.length).to.equal(1);

//             var data = response.body.data[0];

//             test.expect(data.id).to.exist;
//             test.expect(data.username).to.not.equal('');
//             test.expect(data.email).to.not.equal('');
//             test.expect(data.created_on).to.exist;
//             test.expect(data.updated_on).to_exist;
//             test.expect(data.login_on).to.equal('');
//         });

//         it('should expect username and email to be unique in DB', function * () {
//             var dbUsersWithUsernameCallback = test.db.util.user_by_username(user.username);
//             var dbUsersWithEmailCallback = test.db.util.user_by_email(user.email);
//             var resultsUsername = yield dbUsersWithUsernameCallback;
//             var resultsEmail = yield dbUsersWithEmailCallback;
//             test.expect(resultsUsername.length).to.equal(1);
//             test.expect(resultsEmail.length).to.equal(1);
//         });
//     });

//     describe('GET /api/v1/user', function() {

//         var userLogin = {
//             username: "test_user",
//             password: "test_user_password1"
//         };

//         it('should expect valid authorization header', function * () {
//             var response = yield test.request.get('/api/v1/user').expect(401).end();
//         });

//         it('should return user list w/valid authorization header', function * () {
//             var responseLogin = yield test.request.post('/api/v1/auth/user').send(userLogin).end();
//             test.checkErrors(responseLogin);
//             var testToken = test.verifyUserToken(responseLogin);
//             var authorizationHeader = {
//                 Authorization: "Bearer " + testToken
//             };
//             response = yield test.request.get('/api/v1/user').set(authorizationHeader).end();
//             test.checkErrors(response);
//             test.expect(response.status, "Authorization Bearer should be valid.").to.not.equal(401);
//             test.expect(response.body.data).to.exist;
//             test.expect(response.body.data).to.be.an('array');
//             // TODO: Constrain Limits of Response Array?
//             // test.expect(response.body.data).to.have.length.within(0,1000); 
//         });
//     });

//     describe('GET /api/v1/user/:id', function() {

//         var userLogin = {
//             username: "test_user",
//             password: "test_user_password1"
//         };

//         it('should expect valid authorization header', function * () {
//             var response = yield test.request.get('/api/v1/user/'+userLogin.username).expect(401).end();
//         });

//         it('should return user object w/valid authorization header', function * () {
//             var responseLogin = yield test.request.post('/api/v1/auth/user').send(userLogin).end();
//             test.checkErrors(responseLogin);
//             var testToken = test.verifyUserToken(responseLogin);
//             var authorizationHeader = {
//                 Authorization: "Bearer " + testToken
//             };
//             response = yield test.request.get('/api/v1/user/'+userLogin.username).set(authorizationHeader).end();
//             test.checkErrors(response);
//             test.expect(response.status, "Authorization Bearer should be valid.").to.not.equal(401);
//             test.expect(response.body.data).to.exist;
//             test.expect(response.body.data).to.be.an('array');
//             test.expect(response.body.data).to.have.length(1);



//         //     var resultsUsername = yield test.db.util.user_by_username(user.username);
//         //     test.expect(resultsUsername.length).to.equal(1);
//         // var existingUser = response.body.data[0];

//             // TODO: Constrain Limits of Response Array?
//             // test.expect(response.body.data).to.have.length.within(0,1000); 
//         });

//     });

//     describe('PUT /api/v1/user', function() {

//         var userUpdate = {
//             phone: "1234567890"
//         };

//         var userUpdateInvalid = {
//             phonez: "5555555555"
//         };

//         it('should expect valid authorization header', function * () {
//             var response = yield test.request.get('/api/v1/user').expect(401).end();
//         });

//         it('should expect value to be modified in DB');
//         it('should fail for invalid key');
//         it('should fail for invalid value');

//     });
// });