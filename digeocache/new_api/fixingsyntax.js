,
            get: function * (next) {
                // console.log("admin.get");
                try {
                    // TODO: Be sure this is being requested by authenticated admin w/proper privileges

                    var id_test = validate.id(this.params.id);
                    var username_test = validate.attribute(admin.schema, this.params.id, "username");
                    var email_test = validate.attribute(admin.schema, this.params.id, "email");

                    // ID (integer) provided in URL
                    if (id_test.valid) {
                        // Request DB return Admin using ID and respond according to success/error
                        return yield db.admin_by_id(id_test.data.toString(), admin.successGet, admin.invalidGet);
                    }
                    // Nothing provided in URL at all for identification
                    else if (!id_test.valid && (this.params.id === undefined || this.params.id === null)) {
                        // Request DB return all Admins and respond according to success/error
                        return yield db.admins_all(admin.successGet, admin.invalidGet);
                    }
                    // Assuming username provided next if completes username validation test
                    else if (username_test.valid) {
                        // Request DB return Admin using username and respond according to success/error
                        return yield db.admin_by_username(username_test.data, admin.successGet, admin.invalidGet);
                    }
                    // Otherwise assuming email provided if completes email validation test
                    else if (email_test.valid) {
                        // Request DB return Admin using email and respond according to success/error
                        return yield db.admin_by_email(email_test.data, admin.successGet, admin.invalidGet);
                    }
                    // Invalid URL Construction
                    else {
                        return yield admin.invalidGet([errors.UNKNOWN_ERROR("bad url getting admin(s)")]);
                    }
                } catch (e) {
                    // Unknown Error
                    return yield admin.invalidGet([errors.UNKNOWN_ERROR("could not retrieve admin(s)")]);
                }
            },
            invalidPut: function(data, errors) {
                return function * (next) {
                    var json = utility.json_response(data, errors);
                    this.type = "application/json";
                    this.body = json;
                };
            },
            successPut: function(data) {
                return function * (next) {
                    var json = utility.json_response(data, null);
                    this.type = "application/json";
                    this.body = json;
                };
            },
            put: function * (next) {
                // console.log("admin.put");
                try {
                    // TODO: Be sure this is being requested by authenticated admin w/proper privileges
                    var admin = undefined;
                    var id_test = validate.id(this.params.id);
                    var username_test = validate.attribute(admin.schema, this.params.id, "username");
                    var email_test = validate.attribute(admin.schema, this.params.id, "email");

                    // ID (integer) provided in URL
                    if (id_test.valid) {
                        // Request DB return Admin using ID and respond according to success/error
                        admin = yield db.admin_by_id(id_test.data.toString(),
                            function(admin) {
                                return admin;
                            },
                            function(errors) {

                            });
                    }
                    // Nothing provided in URL at all for identification
                    else if (!id_test.valid && (this.params.id === undefined || this.params.id === null)) {
                        // Request DB return all Admins and respond according to success/error
                        return yield admin.invalidGet([errors.UNKNOWN_ERROR("must provide an admin identifier to update")]);
                    }
                    // Assuming username provided next if completes username validation test
                    else if (username_test.valid) {
                        // Request DB return Admin using username and respond according to success/error
                        return yield db.admin_by_username(username_test.data, admin.successGet, admin.invalidGet);
                    }
                    // Otherwise assuming email provided if completes email validation test
                    else if (email_test.valid) {
                        // Request DB return Admin using email and respond according to success/error
                        return yield db.admin_by_email(email_test.data, admin.successGet, admin.invalidGet);
                    }
                    // Invalid URL Construction
                    else {
                        return yield admin.invalidGet([errors.UNKNOWN_ERROR("bad url getting admin(s)")]);
                    }




                    ///////
                    var admin_pre = yield parse(this);
                    var admin_test = validate.schemaForUpdate(admin.schema, admin_pre);

                    if (admin_test.valid) {

                        // Check if username / email already in use
                        var usernameTaken = db.admin_username_taken(admin_test.data.username, admin.invalidPut);
                        if (usernameTaken !== undefined) {
                            return yield usernameTaken;
                        }
                        var emailTaken = db.admin_email_taken(admin_test.data.email, admin.invalidPut);
                        if (emailTaken !== undefined) {
                            return yield usernameTaken;
                        }

                        // Is the user tring to change their password?
                        if (admin_test.data.password) {
                            // Generate salt/hash using bcrypt
                            var salt = yield bcrypt.genSalt(10);
                            var hash = yield bcrypt.hash(admin_test.data.password, salt);

                            // Delete password key/value from put object, replace w/hash
                            var pw = admin_test.data.password;
                            delete admin_test.data.password;
                            admin_test.data.hash = hash;
                        }

                        // Add automatic date fields
                        var now = new Date();
                        admin_test.data.updated_on = now;

                        // Request DB Update Node and Respond Accordingly
                        return yield db.admin_update(admin_test.data, id, pre, successResponse, invalidResponse);


                        var results = yield db.admin_create(admin_test.data);
                        if (!results) {
                            // DB Failure to POST
                            this.req.data = null;
                            this.req.errors = [errors.DB_ERROR("failed to create admin")];
                            return yield admin.invalidPost;
                        } else {
                            // Request was successful.
                            this.req.data = results;
                            return yield admin.successPut;
                        }
                    } else {
                        // Request was not valid,
                        this.req.data = admin_pre;
                        this.req.errors = admin_test.errors;
                        return yield admin.invalidPut;
                    }
                } catch (err) {
                    // Database Connectivity Issue
                    if (err.code == "ECONNREFUSED") {
                        return yield admin.invalidPut(admin_pre, [errors.DB_ERROR("database connection issue")]);
                    }
                    // Malformed Cypher Query
                    else if (err.neo4j) {
                        if (err.neo4j.code && err.neo4j.code == "Neo.ClientError.Statement.InvalidSyntax") {
                            return yield admin.invalidPut(admin_pre, [errors.DB_ERROR("malformed query")]);
                        } else {
                            return yield admin.invalidPut(admin_pre, [errors.DB_ERROR("neo4j error")]);
                        }
                    } else {
                        // Unknown Error
                        return yield admin.invalidPut(admin_pre, [errors.UNKNOWN_ERROR("creating admin" + err)]);
                    }
                }
            }
        },
        del: function * (next) {
            // console.log("admin.del");
            try {
                var id = this.params.id
                var success = true;
                this.assert(success, 500, 'Failed to delete admin');
            } catch (e) {
                this.redirect('/error');
            }
        }