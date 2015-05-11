module.exports = function ProtectedAPI_V1(admin) {

    var Router = require('koa-router');

    // var authController = require('./../controllers/auth');
    // var userController = require('./../controllers/user');

    var ProtectedAPI_V1 = new Router();

    // Authentication routes
    ProtectedAPI_V1.get('/auth/logout', function * (next) {
        this.body = "authController.logout";
    });

    // User routes
    ProtectedAPI_V1.get('/user', function * (next) {
        this.body = "userController.getAll";
    });
    ProtectedAPI_V1.get('/user/:id', function * (next) {
        this.body = "userController.getOne";
    });
    ProtectedAPI_V1.put('/user/:id', function * (next) {
        this.body = "userController.put";
    });
    ProtectedAPI_V1.patch('/user/:id', function * (next) {
        this.body = "userController.patch";
    });
    ProtectedAPI_V1.del('/user/:id', function * (next) {
        this.body = "userController.del";
    });

    return ProtectedAPI_V1;
};