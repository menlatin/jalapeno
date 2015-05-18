module.exports = function ProtectedAPI_V1(admin) {

    var Router = require('koa-router');

    // var authController = require('./../controllers/auth');
    // var userController = require('./../controllers/user');

    var ProtectedAPI_V1 = new Router();

    // Logout Route
    ProtectedAPI_V1.get('/auth/logout', function * (next) {
        this.body = "authController.logout";
    });

    // Admin routes
    ProtectedAPI_V1.get('/admin', admin.get);
    ProtectedAPI_V1.get('/admin/:id', admin.get);
    ProtectedAPI_V1.put('/admin', admin.put);
    ProtectedAPI_V1.put('/admin/:id', admin.put);
    ProtectedAPI_V1.del('/admin', admin.del);
    ProtectedAPI_V1.del('/admin/:id', admin.del);

    // User routes

    return ProtectedAPI_V1;
};