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



var resetAdminInDatabase = function * () {

    var admin = {
        username: "test_admin",
        password: "test_admin_password1",
        firstname: "Test",
        lastname: "Admin",
        email: "elliott.syep@gmail.com",
        birthday: "1969-12-31T06:00:00.000Z",
        phone: "5558675309"
    };

    // Initial Request May Fail in Error if Test User Lingering in Database
    // Check if username / email already in use
    var deleteUsername = "undefined";
    var deleteEmail = "undefined";
    var usernameTakenErrors = test.db.admin_username_taken(admin.username);
    if (usernameTakenErrors !== undefined) {
        deleteUsername = test.db.admin_delete_by_username(admin.username);
    }
    var emailTakenErrors = test.db.admin_email_taken(admin.email);
    if (emailTakenErrors !== undefined) {
        deleteEmail = test.db.admin_delete_by_email(admin.email);
    }
    deleteUsername.then(deleteEmail).then(
        function(result) {
            console.log("USERNAME/EMAIL DELETE RESULT = ", results);
        },
        function(errors) {
            console.log("USERNAME/EMAIL DELETE ERRORS = ", errors);
        }
    );

    // Generate salt/hash using bcrypt
    var salt = yield test.bcrypt.genSalt(10);
    var hash = yield test.bcrypt.hash(admin.password, salt);

    // Delete password key/value from post object, replace w/hash
    var pw = admin.password;
    delete admin.password;
    admin.hash = hash;

    // Add automatic date fields
    var now = new Date();
    admin.created_on = now;
    admin.updated_on = now;
    admin.login_on = "";

    // Request DB Create Node and Respond Accordingly
    var create = test.db.admin_create(admin);
    var response = create.then(
        function(data) {
            console.log("CREATE SUCCESS admin returned = ", data);
            test.expect(data.id).to.exist;
            test.expect(data.username).to.not.equal('');
            test.expect(data.email).to.not.equal('');
            test.expect(data.created_on).to.exist;
            test.expect(data.updated_on).to_exist;
            test.expect(data.login_on).to.equal('');
        },
        function(errors) {
            test.expect(errors).to.not.exist;
        }
    );
    return yield response;
}



/* 
	API Endpoint Tests for Admin
 */
describe('ADMIN TESTS', function() {




    // describe('POST /api/v1/auth/admin', function() {



    //     var adminLogin = {
    //         username: "test_admin",
    //         password: "test_admin_password1"
    //     };

    //     it('should authenticate with valid username/password', function * () {

    //         yield resetAdminInDatabase();


    //         var response = yield test.request.post('/api/v1/auth/admin').send(adminLogin).end();
    //         test.checkErrors(response);
    //         test.verifyAdminToken(response);
    //     });

    //     it('should authenticate with valid email/password', function * () {
    //         // Use email in place of username ("@" should be auto-detected and validated as email)
    //         adminLogin.username = "test_admin@digeocache.com";
    //         var response = yield test.request.post('/api/v1/auth/admin').send(adminLogin).end();
    //         test.checkErrors(response);
    //         test.verifyAdminToken(response);
    //     });

    //     it('should fail authentication with incorrect password', function * () {
    //         adminLogin.password = "Hello4321";
    //         var response = yield test.request.post('/api/v1/auth/admin').send(adminLogin).end();
    //         test.expectErrors(response, [test.errors.login.PASSWORD_INCORRECT('password')]);
    //     });

    //     it('should fail authentication with invalid username and password', function * () {
    //         adminLogin.username = "invali^U$eNam[";
    //         adminLogin.password = "~";
    //         var response = yield test.request.post('/api/v1/auth/admin').send(adminLogin).end();
    //         test.expectErrors(response, [test.errors.user.USERNAME_INVALID('username'), test.errors.user.PASSWORD_INVALID('password')]);
    //     });
    // });

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
            // // Initial Request May Fail in Error if Test User Lingering in Database
            // var usernameTaken = yield test.db.admin_username_taken(admin.username);
            // var emailTaken = yield test.db.admin_email_taken(admin.email);

            // if (usernameTaken.success && usernameTaken.data.success) {
            //     var usernameDeleteResult = yield test.db.admin_delete_by_username(admin.username);
            //     test.expect(usernameDeleteResult.success).to.equal(true);
            // }
            // if (emailTaken.success && emailTaken.data.success) {
            //     var emailDeleteResult = yield test.db.admin_delete_by_email(admin.email);
            //     test.expect(emailDeleteResult.success).to.equal(true);
            // }
            // yield resetAdminInDatabase();

            // Make Request Now That Cleanup is Finished
            response = yield test.request.post('/api/v1/admin').send(admin).expect(200).end();

            test.checkErrors(response);
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
            var admin_by_username = test.db.admin_by_username(admin.username);
            var admin_by_email = test.db.admin_by_email(admin.email);

            test.expect(admin_by_username.success).to.equal(true);
            test.expect(admin_by_email.success).to.equal(true);

            test.expect(admin_by_username.data.length).to.equal(1);
            test.expect(admin_by_username.data.length).to.equal(1);
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