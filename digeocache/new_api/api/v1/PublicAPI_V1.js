module.exports = function PublicAPI_V1(admin) {

    var Router = require('koa-router');

    var PublicAPI_V1 = new Router();

    // admin signup
    PublicAPI_V1.post('/admin', admin.post);

    // admin login
    PublicAPI_V1.post('/auth/login', function * next() {
        this.body = "authController.login";
    });

    return PublicAPI_V1;
};