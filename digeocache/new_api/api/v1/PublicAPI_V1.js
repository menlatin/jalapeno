module.exports = function PublicAPI_V1(admin, adminLogin, user, userLogin) {

    var Router = require('koa-router');

    var PublicAPI_V1 = new Router();

    // admin signup and login
    PublicAPI_V1.post('/admin', admin.post);
    PublicAPI_V1.post('/auth/admin', adminLogin.post);

    // user signup and login
    PublicAPI_V1.post('/user', user.post);
    PublicAPI_V1.post('/auth/user', userLogin.post);

    return PublicAPI_V1;
};