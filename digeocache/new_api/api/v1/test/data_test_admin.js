var Errors = require('../Errors.js');
var errors = new Errors();

var data = {};
data.auth = {};
data.post = {};
data.get = {};
data.put = {};
data.del = {};

data.auth.baseline = [];
data.auth.baseline[0] = {
    username: "test_auth_good_admin1",
    password: "test_auth_good_admin_password1",
    firstname: "TestAuth",
    lastname: "GoodAdmin1",
    email: "test_auth_good_admin1@gmail.com",
    birthday: "1969-12-31T06:00:00.000Z",
    phone: "5558675309"
};

data.auth.tests = [];
data.auth.tests[0] = {
    should: "authenticate with existing username/password",
    endpoint: "/api/v1/auth/admin",
    credentials: {
        username: "test_auth_good_admin1",
        password: "test_auth_good_admin_password1"
    },
    expect: 200,
    errors: undefined
};

data.auth.tests[1] = {
    should: "authenticate with existing email/password",
    endpoint: "/api/v1/auth/admin",
    credentials: {
        username: "test_auth_good_admin1@gmail.com",
        password: "test_auth_good_admin_password1"
    },
    expect: 200,
    errors: undefined
};

data.auth.tests[2] = {
    should: "fail authentication with non-existent username/password",
    endpoint: "/api/v1/auth/admin",
    credentials: {
        username: "test_auth_bad_admin1",
        password: "test_auth_bad_admin_password1"
    },
    expect: 200,
    errors: [errors.LOGIN_FAILURE()]
};

data.auth.tests[3] = {
    should: "fail authentication with non-existent email/password",
    endpoint: "/api/v1/auth/admin",
    credentials: {
        username: "test_auth_bad_admin1@gmail.com",
        password: "test_auth_bad_admin_password1"
    },
    expect: 200,
    errors: [errors.LOGIN_FAILURE()]
};

data.auth.tests[4] = {
    should: "fail authentication with existing username and incorrect password",
    endpoint: "/api/v1/auth/admin",
    credentials: {
        username: "test_auth_good_admin1",
        password: "test_auth_bad_admin_password1"
    },
    expect: 200,
    errors: [errors.LOGIN_FAILURE()]
};

data.auth.tests[5] = {
    should: "fail authentication with existing email and incorrect password",
    endpoint: "/api/v1/auth/admin",
    credentials: {
        username: "test_auth_good_admin1@gmail.com",
        password: "test_auth_bad_admin_password1"
    },
    expect: 200,
    errors: [errors.LOGIN_FAILURE()]
};

data.auth.tests[6] = {
    should: "fail authentication with invalid username and password",
    endpoint: "/api/v1/auth/admin",
    credentials: {
        username: "$&#^@&",
        password: "_"
    },
    expect: 200,
    errors: [errors.ATTRIBUTE_INVALID()]
}

data.post.baseline = [];
data.post.baseline[0] = {
    username: "test_post_existing_admin1",
    password: "test_post_existing_admin_password1",
    firstname: "TestPost",
    lastname: "ExistingAdmin1",
    email: "test_post_existing_admin1@gmail.com",
    birthday: "1969-12-31T06:00:00.000Z",
    phone: "5558675309"
};

data.post.tests = [];
data.post.tests[0] = {
    should: "create valid and unique admin object",
    endpoint: "/api/v1/admin",
    payload: {
        username: "test_post_new_admin1",
        password: "test_post_new_admin_password1",
        firstname: "TestPost",
        lastname: "NewAdmin1",
        email: "test_post_new_admin1@gmail.com",
        birthday: "1969-12-31T06:00:00.000Z",
        phone: "5558675309"
    },
    expect: 200,
    errors: undefined
};
data.post.tests[1] = {
    should: "fail to create valid but non-unique admin object",
    endpoint: "/api/v1/admin",
    payload: {
        username: "test_post_existing_admin1",
        password: "test_post_existing_admin_password1",
        firstname: "TestPost",
        lastname: "ExistingAdmin1",
        email: "test_post_existing_admin1@gmail.com",
        birthday: "1969-12-31T06:00:00.000Z",
        phone: "5558675309"
    },
    expect: 200,
    errors: [errors.USERNAME_TAKEN(), errors.EMAIL_TAKEN()]
};
data.post.tests[2] = {
    should: "fail to create invalid admin object",
    endpoint: "/api/v1/admin",
    payload: {
        username: "^*&@#@(",
        password: ")))",
        firstname: "<<<<",
        lastname: ">>",
        email: "notanemail",
        birthday: "7&",
        phone: "...",
        fake: "this is not a valid field",
    },
    expect: 200,
    errors: [errors.ATTRIBUTE_INVALID()]
};

data.get.baseline = [];
data.get.baseline[0] = {
    username: "test_get_admin1",
    password: "test_get_admin_password1",
    firstname: "TestGet",
    lastname: "Admin1",
    email: "test_get_admin1@gmail.com",
    birthday: "1969-12-31T06:00:00.000Z",
    phone: "5558675309"
};
data.get.baseline[1] = {
    username: "test_get_admin2",
    password: "test_get_admin_password2",
    firstname: "TestGet",
    lastname: "Admin2",
    email: "test_get_admin2@gmail.com",
    birthday: "1969-12-31T06:00:00.000Z",
    phone: "5558675309"
};
data.get.baseline[2] = {
    username: "test_get_admin3",
    password: "test_get_admin_password3",
    firstname: "TestGet",
    lastname: "Admin3",
    email: "test_get_admin3@gmail.com",
    birthday: "1969-12-31T06:00:00.000Z",
    phone: "5558675309"
};

data.get.tests = [];
data.get.tests[0] = {
    should: "fail without valid authorization header",
    endpoint: "/api/v1/admin",
    credentials: undefined,
    expect: 401,
    errors: [errors.UNAUTHORIZED()]
};
data.get.tests[1] = {
    should: "return admin list with valid authorization header",
    endpoint: "/api/v1/admin",
    credentials: {
        username: "test_get_admin1",
        password: "test_get_admin_password1"
    },
    expect: 200,
    errors: undefined
};
data.get.tests[2] = {
    should: "return admin identified by username with valid authorization header",
    endpoint: "/api/v1/admin/test_get_admin1",
    credentials: {
        username: "test_get_admin1",
        password: "test_get_admin_password1"
    },
    expect: 200,
    errors: undefined
};
data.get.tests[3] = {
    should: "return admin identified by email with valid authorization header",
    endpoint: "/api/v1/admin/test_get_admin1@gmail.com",
    credentials: {
        username: "test_get_admin1",
        password: "test_get_admin_password1"
    },
    expect: 200,
    errors: undefined
};
data.get.tests[4] = {
    should: "return admin identified by id with valid authorization header",
    endpoint: "/api/v1/admin/:id",
    credentials: {
        username: "test_get_admin1",
        password: "test_get_admin_password1"
    },
    expect: 200,
    errors: undefined
};
data.get.tests[5] = {
    should: "fail to return admin identified improperly with valid authorization header",
    endpoint: "/api/v1/admin/?x42z",
    credentials: {
        username: "test_get_admin1",
        password: "test_get_admin_password1"
    },
    expect: 200,
    errors: [errors.UNIDENTIFIABLE()]
};

data.put.baseline = [];
data.put.baseline[0] = {
    username: "test_put_admin1",
    password: "test_put_admin_password1",
    firstname: "TestPut",
    lastname: "Admin1",
    email: "test_put_admin1@gmail.com",
    birthday: "1969-12-31T06:00:00.000Z",
    phone: "5558675309"
};
data.put.tests = [];
data.put.tests[0] = {
    should: "fail without valid authorization header",
    endpoint: "/api/v1/admin/test_put_admin1",
    credentials: undefined,
    payload: {
        firstname: "TestPutNewNameNotLoggedIn"
    },
    expect: 401,
    errors: [errors.UNAUTHORIZED()]
};
data.put.tests[1] = {
    should: "update allowable admin properties using username with valid authorization header",
    endpoint: "/api/v1/admin/test_put_admin1",
    credentials: {
        username: "test_put_admin1",
        password: "test_put_admin_password1"
    },
    payload: {
        firstname: "TestPutUsingUsername",
        lastname: "Admin1Forever1"
    },
    expect: 200,
    errors: undefined
};
data.put.tests[2] = {
    should: "update allowable admin properties using email with valid authorization header",
    endpoint: "/api/v1/admin/test_put_admin1@gmail.com",
    credentials: {
        username: "test_put_admin1",
        password: "test_put_admin_password1"
    },
    payload: {
        firstname: "TestPutUsingEmail",
        lastname: "Admin1Forever2"
    },
    expect: 200,
    errors: undefined
};
data.put.tests[3] = {
    should: "update allowable admin properties using id with valid authorization header",
    endpoint: "/api/v1/admin/:id",
    credentials: {
        username: "test_put_admin1",
        password: "test_put_admin_password1"
    },
    payload: {
        firstname: "TestPutUsingID",
        lastname: "Admin1Forever3"
    },
    expect: 200,
    errors: undefined
};
data.put.tests[4] = {
    should: "fail to update allowable admin properties if identified improperly with valid authorization header",
    endpoint: "/api/v1/admin/?x42z",
    credentials: {
        username: "test_put_admin1",
        password: "test_put_admin_password1"
    },
    payload: {
        firstname: "TestPutUsingBadID",
        lastname: "Admin1Forever4"
    },
    expect: 200,
    errors: [errors.UNIDENTIFIABLE()]
};
data.put.tests[5] = {
    should: "fail to update fields with invalid values",
    endpoint: "/api/v1/admin/test_put_admin1",
    credentials: {
        username: "test_put_admin1",
        password: "test_put_admin_password1"
    },
    payload: {
        firstname: ".",
        lastname: "!",
        email: "totally",
        birthday: "1869-12-31T06:00:00.000Z",
        phone: "00<<"
    },
    expect: 200,
    errors: [errors.ATTRIBUTE_INVALID()]
};

data.del.baseline = [];
data.del.baseline[0] = {
    username: "test_del_admin1",
    password: "test_del_admin_password1",
    firstname: "TestDel",
    lastname: "Admin1",
    email: "test_del_admin1@gmail.com",
    birthday: "1969-12-31T06:00:00.000Z",
    phone: "5558675309"
};
data.del.tests = [];
data.del.tests[0] = {
    should: "fail without valid authorization header",
    endpoint: "/api/v1/admin/test_del_admin1",
    credentials: undefined,
    expect: 401,
    errors: [errors.UNAUTHORIZED()]
};
data.del.tests[1] = {
    should: "fail when identified improperly with valid authorization header",
    endpoint: "/api/v1/admin/$43",
    credentials: {
        username: "test_del_admin1",
        password: "test_del_admin_password1"
    },
    expect: 200,
    errors: [errors.UNIDENTIFIABLE()]
};
data.del.tests[2] = {
    should: "delete admin identified by username with valid authorization header",
    endpoint: "/api/v1/admin/test_del_admin1",
    credentials: {
        username: "test_del_admin1",
        password: "test_del_admin_password1"
    },
    expect: 200,
    errors: undefined
};

module.exports = data;