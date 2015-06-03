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

module.exports = function Validate(errors) {

    var _ = require('lodash');
    var moment = require('moment');

    var adminValidate = require('./admin/AdminValidate.js')(errors);
    var userValidate = require('./user/UserValidate.js')(errors);
    var geocacheValidate = require('./geocache/geocacheValidate.js')(errors);

    var validate = {
        isEmpty: function isEmpty(data) {
            if (typeof(data) == "number" || typeof(data) == "boolean") {
                return false;
            }
            if (typeof(data) == "undefined" || data == null) {
                return true;
            }
            if (typeof(data.length) != 'undefined') {
                return data.length === 0;
            }
            var count = 0;
            for (var i in data) {
                if (data.hasOwnProperty(i)) {
                    count++;
                }
            }
            return count === 0;
        },
        schema: function schema(sch, pre) {
            var valid = true;
            var errorArray = [];

            // Extract Fields from Schema Which Are Not Auto-Generated by Server
            var nonAutoSchema = sch.filter(function(s) {
                return !s.auto;
            });

            // Fields Provided
            var fields = Object.keys(pre);

            // For Each Attribute Required By Form
            for (var i = 0; i < nonAutoSchema.length; i++) {
                var nonAutoScheme = nonAutoSchema[i];
                var fieldAttribute = nonAutoScheme.attribute;

                var isFieldMissing = false;
                var isFieldEmpty = false;
                var fieldValue = null;

                // Check if Field is Missing or Empty
                isFieldMissing = !(fields.indexOf(fieldAttribute) in fields);
                if (!isFieldMissing) {
                    fieldValue = pre[fieldAttribute].trim();
                    isFieldEmpty = validate.isEmpty(fieldValue);
                }

                // The Field is Missing or Empty
                if (isFieldMissing || isFieldEmpty) {

                    // Required fields missing results in a validation error
                    if (nonAutoScheme.required) {
                        valid = false;
                        errorArray.push(errors.ATTRIBUTE_REQUIRED(fieldAttribute));
                    }
                    // Otherwise this field can be ignored as empty
                    else {
                        pre[fieldAttribute] = "";
                    }
                    // Continue to the next field check without collecting futher errors on this
                    continue;
                }
                // The Field is Present, Check for Validity
                else {
                    if (typeof(nonAutoScheme.test) == "function" && nonAutoScheme.test.length == 2) {
                        var test = nonAutoScheme.test(fieldAttribute, fieldValue ? fieldValue : "");
                        if (test.valid) {
                            pre[fieldAttribute] = test.data;
                        } else {
                            valid = false;
                            errorArray = errorArray.concat(test.errors);
                        }
                    }
                    // Required fields must have an associated 'test' validation function.
                    // which takes the attribute name and attribute value as parameters.
                    else {
                        valid = false;
                        errorArray.push(errors.ATTRIBUTE_TEST_REQUIRED(fieldAttribute));
                    }
                }
            } // end for

            if (valid) {
                return {
                    valid: valid,
                    data: pre
                };
            } else {
                return {
                    valid: valid,
                    errors: errorArray
                };
            }
        },
        // schemaForDelete: function schemaForDelete(sch, pre) {
        //     var preKeys = _.keys(pre);
        //     if (preKeys.length > 1) {
        //         return {
        //             valid: false,
        //             errors: [errors.user.DELETE_REQUIRES_UNIQUE_ID()]
        //         }
        //     } else if (preKeys.length == 0) {
        //         return validate.schema(modifiedSchema, pre);
        //     } else if (preKeys.length == 1) {
        //         if (pre.username || pre.email) {
        //             return validateSchema
        //         }
        //     }
        // },
        schemaForUpdate: function schemaForUpdate(sch, pre) {
            // Make sure we are providing something to update at all
            if ("false" in pre) {
                return {
                    valid: false,
                    errors: [errors.UPDATE_EMPTY()]
                }
            }
            // Make sure we aren't trying to update things we shouldn't
            var errorArray = [];
            var isBadUpdate = false;
            _.forIn(pre, function(value, key) {
                var updateFieldInSchema = _.find(sch, {
                    attribute: key
                });
                if (!updateFieldInSchema || updateFieldInSchema.auto) {
                    // Trying to update a key that DNE or is handled automatically
                    isBadUpdate = true;
                    errorArray.push(errors.ATTRIBUTE_INVALID(key));
                }
            });

            if (isBadUpdate) {
                return {
                    valid: false,
                    errors: errorArray
                };
            }
            // Only need to validate against what we are trying to update
            var modifiedSchema = _.filter(sch, function(s) {
                // if s.attribute is a key in pre
                var f = _.findIndex(_.keys(pre), function(a) {
                    return a == s.attribute;
                });
                return f != -1;
            });
            return validate.schema(modifiedSchema, pre);
        },
        attribute: function attribute(sch, pre, att) {
            // Extract Scheme from Schema Which Defines Attribute
            var attributeSchemes = sch.filter(function(s) {
                return s.attribute == att;
            });
            var attributeScheme = attributeSchemes[0];
            if (typeof(attributeScheme.test) == "function" && attributeScheme.test.length == 2) {
                return attributeScheme.test(att, pre ? pre : "");
            }
            return {
                valid: false,
                errors: [errors.ATTRIBUTE_TEST_REQUIRED(att)]
            };
        },
        id: function id(pre) {
            if (Number.isInteger(Number(pre)) && (pre !== null) && (pre !== undefined)) {
                return {
                    valid: true,
                    data: pre
                };
            }
            return {
                valid: false,
                errors: [errors.ATTRIBUTE_INVALID("id")]
            };
        },
        getQueryVariable: function(queryStr, queryVar) {
            var queryVars = queryStr.split('&');
            for (var i = 0; i < queryVars.length; i++) {
                var pair = queryVars[i].split('=');
                if (decodeURIComponent(pair[0]) == queryVar) {
                    return decodeURIComponent(pair[1]);
                }
            }
            return null;
        },
        userID: function(userID, userSchema, db) {
            return function * (next) {
                var response = {};
                var id_test = validate.id(userID);
                var username_test = validate.attribute(userSchema, userID, "username");
                var email_test = validate.attribute(userSchema, userID, "email");

                if (id_test.valid) {
                    var userByID = yield db.user_by_id(id_test.data.toString());
                    if (userByID.success) {
                        response.valid = true;
                        response.data = userByID.data;
                    } else {
                        response.valid = false;
                        response.errors = userByID.errors;
                    }
                } else if (username_test.valid) {
                    var userByUsername = yield db.user_by_username(username_test.data);
                    if (userByUsername.success) {
                        response.valid = true;
                        response.data = userByUsername.data;
                    } else {
                        response.valid = false;
                        response.errors = userByUsername.errors;
                    }
                } else if (email_test.valid) {
                    var userByEmail = yield db.user_by_email(email_test.data);
                    if (userByEmail.success) {
                        response.valid = true;
                        response.data = userByEmail.data;
                    } else {
                        response.valid = false;
                        response.errors = userByEmail.errors;
                    }
                } else {
                    response.valid = false;
                    response.errors = [errors.UNIDENTIFIABLE(userID)];
                }
                // Need to be sure this gives back a User and not empty array!
                // Somehow we detected a valid id/username/email but still wasn't in DB
                if (response.valid == true && response.data.length == 0) {
                    response.valid = false;
                    response.errors = [errors.UNIDENTIFIABLE(userID)];
                }
                return response;
            };
        },
        regex: function(regex) {
            return function(attribute, value) {
                var valid = regex.test(value);
                if (!valid) {
                    return {
                        valid: false,
                        errors: [errors.ATTRIBUTE_INVALID(attribute)]
                    };
                } else {
                    return {
                        valid: true,
                        data: value
                    };
                }
            };
        },
        bool: function() {
            return function(attribute, value) {
                if (_.isBoolean(value) || value == "true" || value == "false") {
                    var boolLiteral = undefined;
                    if (value == "true") {
                        boolLiteral = true;
                    }
                    else if (value == "false") {
                        boolLiteral = false;
                    }
                    else {
                        boolLiteral = value;
                    }
                    return {
                        valid: true,
                        data: boolLiteral
                    }
                } else {
                    return {
                        valid: false,
                        errors: [errors.ATTRIBUTE_INVALID(attribute)]
                    };
                }
            };
        },
        latitude: function() {
            return function(attribute, value) {
                if (value) {
                    var lat = Number(value);
                    if (lat >= -90 && lat <= 90) {
                        return {
                            valid: true,
                            data: lat
                        };
                    }
                }
                return {
                    valid: false,
                    errors: [errors.ATTRIBUTE_INVALID(attribute)]
                };
            };
        },
        longitude: function() {
            return function(attribute, value) {
                if (value) {
                    var lng = Number(value);
                    if (lng >= -180 && lng <= 180) {
                        return {
                            valid: true,
                            data: lng
                        };
                    }
                }
                return {
                    valid: false,
                    errors: [errors.ATTRIBUTE_INVALID(attribute)]
                };
            };
        },
        coordinate: function() {
            return function(attribute, value) {
                if (value) {
                    var coords = value.split(',');
                    if (coords.length == 2) {
                        var lat = coords[0];
                        var lng = coords[1];
                        var test_lat = validate.latitude()("lat", lat);
                        var test_lng = validate.longitude()("lng", lng);
                        if (test_lat.valid && test_lng.valid) {
                            return {
                                valid: true,
                                data: {
                                    lat: test_lat.data,
                                    lng: test_lng.data
                                }
                            };
                        }
                    }
                }
                return {
                    valid: false,
                    errors: [errors.ATTRIBUTE_INVALID(attribute)]
                };
            };
        },
        doubleRange: function(range) {
            return function(attribute, value) {
                if (value) {
                    var dbl = Number(value);
                    if (_.isFinite(dbl) && ((dbl >= range.min) || (dbl <= range.max))) {
                        return {
                            valid: true,
                            data: dbl
                        }
                    }
                }
                return {
                    valid: false,
                    errors: [errors.ATTRIBUTE_INVALID(attribute)]
                }
            };
        },
        dateInRange: function(range) {
            return function(attribute, value) {
                var date = moment(value, "YYYY-MM-DDTHH:mm:ss.SSSZ", true);
                var valid = date.isValid();
                if (valid && !(date.isBefore(range.min) || date.isAfter(range.max))) {
                    return {
                        valid: true,
                        data: date.toISOString()
                    };

                } else {
                    return {
                        valid: false,
                        errors: [errors.ATTRIBUTE_INVALID(attribute)]
                    };
                }
            }
        },
        dateRange: function() {
            return function(attribute, value) {
                if (!value) {
                    return {
                        valid: false,
                        errors: [errors.ATTRIBUTE_INVALID(attribute)]
                    };
                }
                var range = value.split(',');
                if (range.length == 2) {
                    var start = range[0];
                    var stop = range[1];
                    var startMoment = moment(start, "YYYY-MM-DDTHH:mm:ss.SSSZ", true);
                    var stopMoment = moment(stop, "YYYY-MM-DDTHH:mm:ss.SSSZ", true);
                    var validStart = startMoment.isValid();
                    var validStop = stopMoment.isValid();

                    if (validStart && validStop && (validStart < validStop)) {
                        return {
                            valid: true,
                            data: {
                                start: startMoment.toISOString(),
                                stop: stopMoment.toISOString()
                            }
                        };
                    }
                }
                return {
                    valid: false,
                    errors: [errors.ATTRIBUTE_INVALID(attribute)]
                };
            }
        },
        category: function() {
            return validate.regex(/^(RACE|CHARITY|RANDOM|ALL)$/i);
        },
        distance: function() {
            return validate.doubleRange({
                min: 1.0,
                max: 20000.0
            });
        },
        visits: function() {
            return function(attribute, value) {

            };
        }
    };

    // Merge Database Utility Functions for Models
    _.merge(validate, adminValidate);
    _.merge(validate, userValidate);
    _.merge(validate, geocacheValidate);

    return validate;
};