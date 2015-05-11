//test/endpoint.js
var app = require('../server.js');

var Database = require('../Database.js');
var Errors = require('../Errors.js');

var db = new Database('http://localhost:7474');
var errors = new Errors();

var request = require('co-supertest').agent(app.listen());
var expect = require('chai').expect;

/* 
	API Endpoint Tests
 */
describe('/api/v1/admin endpoint', function() {

    // it('GET should return JSON admin data', function * () {
    //     var res = yield request.get('/api/v1/admin')
    //     .expect(200)
    //     .expect('Content-Type', /json/)
    //     .end();
    //     // expect(res'Content-Type', /json/);
    //     // expect(res.text).to.equal('Hello, World');
    // });


    describe('POST /api/v1/admin', function() {

        it('should create an admin object', function * () {

            var admin = {
                username: "test_admin",
                password: "test_admin_password1",
                firstname: "Test",
                lastname: "Admin",
                email: "test_admin@digeocache.com",
                birthday: "1969-12-31T06:00:00.000Z",
                phone: "5558675309"
            };
            

            // Initial Request May Fail in Error if Test User Lingering in Database
            var res = yield request.post('/api/v1/admin').send(admin).end();

            // Delete Any Users in the Database with this Username or Email
            var usernameTaken = false;
            var emailTaken = false;
            if (res.body.errors) {
                var taken = res.body.errors.some(
                    function isTaken(error, index, array) {
                        usernameTaken = error.code == errors.user.USERNAME_TAKEN().code;
                        emailTaken = error.code == errors.user.EMAIL_TAKEN().code;
                        return (usernameTaken || emailTaken);
                    }
                );

                var dbDeleteCallback = null;
                if (usernameTaken) {
                    dbDeleteCallback = db.util.admin_delete_by_username(admin.username);
                } else if (emailTaken) {
                    dbDeleteCallback = db.util.admin_delete_by_email(admin.email);
                }
                var results = yield dbDeleteCallback;

                // Try Again After Deleting Zombie Test User
                expect(!results).to.equal(false);
                res = yield request.post('/api/v1/admin').send(admin).expect(200).end();
            }

            expect(res.body.errors).to.not.exist;
            expect(res.body.data.length).to.equal(1);

            var data = res.body.data[0];

            expect(data.id).to.exist;
            expect(data.created_on).to.exist;
            expect(data.updated_on).to_exist;
            expect(data.login_on).to.equal('');


            // it('should expect username to be unique'), function * () {
            // 	res = yield request.post('/api/v1/admin').send(admin).expect(200).end();
            // 	console.log("RES 1 = ", res.body.data);
            // 	res = yield request.post('/api/v1/admin').send(admin).expect(200).end();
            // 	console.log("RES 2 = ", res.body.data);

            // };



        });
    });



});