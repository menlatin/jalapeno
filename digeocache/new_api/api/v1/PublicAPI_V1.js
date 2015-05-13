module.exports = function PublicAPI_V1(admin, adminLogin) {

    var Router = require('koa-router');

    var PublicAPI_V1 = new Router();

    // admin signup
    PublicAPI_V1.post('/admin', admin.post);

    // admin login
    PublicAPI_V1.post('/auth/admin', adminLogin.post);

    return PublicAPI_V1;
};