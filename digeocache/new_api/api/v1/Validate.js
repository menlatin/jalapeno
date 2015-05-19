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

    var adminValidate = require('./admin/AdminValidate.js')();
    var userValidate = require('./user/userValidate.js')();

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

                    console.log("nonAutoScheme.test = ", nonAutoScheme.test);

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
            if (Number.isInteger(Number(pre))) {
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
        dateRange: function(range) {
            return function(attribute, value) {
                var date = moment(value, "YYYY-MM-DDTHH:mm:ss.SSSZ", true);
                var valid = date.isValid();
                if (valid) {
                    if (date.isBefore(range.min) || date.isAfter(range.max)) {
                        return {
                            valid: false,
                            errors: [errors.ATTRIBUTE_INVALID(attribute)]
                        };
                    } else {
                        return {
                            valid: true,
                            data: date.toISOString()
                        };
                    }
                } else {
                    return {
                        valid: false,
                        errors: [errors.ATTRIBUTE_INVALID(attribute)]
                    };
                }
            }
        }
    };

    // Merge Database Utility Functions for Models
    _.merge(validate, adminValidate);
    _.merge(validate, userValidate);

    return validate;
};