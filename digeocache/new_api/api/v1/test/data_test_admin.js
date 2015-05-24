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





module.exports = data;