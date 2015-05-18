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

module.exports = function Errors() {
    var errors = Object.freeze({
        /*
            Authentication and General API Errors
        */
        UNAUTHORIZED: function() {
            return {
                code: 401,
                message: "Unauthorized to view this resource."
            };
        },
        UNPRIVILEGED: function() {
            return {
                code: 401,
                message: "Unprivileged to view this resource."
            };
        },
        UNSUPPORTED: function() {
            return {
                code: 402,
                message: "Unsupported API operation."
            };
        },
        UNKNOWN_ERROR: function(context) {
            return {
                code: 1001,
                message: "Unknown error: " + context
            };
        },
        /*
            Database Errors
        */
        DB_ERROR: function(context) {
            return {
                code: 1002,
                message: "DB query error: " + context
            }
        },
        DB_EMPTY_RESULT: function() {
            return {
                code: 1003,
                message: "DB query result was empty"
            }
        },
        DB_EXPECTED_ONE_RESULT: function() {
            return {
                code: 1004,
                message: "DB query result expected only one result and found many"
            }
        },
        DB_UNDEFINED_RESULT: function() {
            return {
                code: 1005,
                message: "DB query result was undefined"
            }
        },
        /*
            Validation Errors
        */
        ID_INVALID: function(id) {
            return {
                code: 1006,
                message: id + " is not a valid id"
            }
        },
        UNIDENTIFIABLE: function(modelName) {
            return {
                code: 5001,
                message: "unidentifiable from URL"
            }
        },
        INVALID_UPDATE: function() {
            return {
                code: 5002,
                message: "update has invalid values"
            }
        },
        ATTRIBUTE_TEST_REQUIRED: function(attribute) {
            return {
                code: 2001,
                message: attribute + " mandates a test function for validation"
            };
        },
        ATTRIBUTE_REQUIRED: function(attribute) {
            return {
                code: 2002,
                attribute: attribute,
                message: attribute + " required"
            };
        },
        ATTRIBUTE_INVALID: function(attribute) {
            return {
                code: 2003,
                attribute: attribute,
                message: attribute + " required"
            };
        },
        USERNAME_NOT_FOUND: function(attribute) {
            return {
                code: 3001,
                attribute: attribute,
                message: "username not found"
            };
        },
        EMAIL_NOT_FOUND: function(attribute) {
            return {
                code: 3002,
                attribute: attribute,
                message: "email not found"
            };
        },
        PASSWORD_INCORRECT: function(attribute) {
            return {
                code: 3003,
                attribute: attribute,
                message: "the password you entered is incorrect"
            };
        },
        LOGIN_FAILURE: function() {
            return {
                code: 3004,
                message: "failed to login with these credentials, please try again"
            };
        }
        ID_NOT_FOUND: function() {
            return {
                code: 4001,
                message: "user not found for this id"
            }
        },
        USERNAME_TAKEN: function(attribute) {
            return {
                code: 4003,
                attribute: attribute,
                message: "username taken"
            };
        },
        EMAIL_TAKEN: function(attribute) {
            return {
                code: 4008,
                attribute: attribute,
                message: "email taken"
            };
        },


        // Geocache POST Validation Errors
        geocache: {
            TITLE_REQUIRED: function(attribute) {
                return {
                    code: 5001,
                    attribute: attribute,
                    message: "title required"
                };
            },
            TITLE_INVALID: function(attribute) {
                return {
                    code: 5002,
                    attribute: attribute,
                    message: "title invalid (must be ...)"
                };
            },
            MESSAGE_REQUIRED: function(attribute) {
                return {
                    code: 5003,
                    attribute: attribute,
                    message: "message required"
                };
            },
            MESSAGE_INVALID: function(attribute) {
                return {
                    code: 5004,
                    attribute: attribute,
                    message: "message invalid (must be ...)"
                };
            },
            CURRENCY_REQUIRED: function(attribute) {
                return {
                    code: 5005,
                    attribute: attribute,
                    message: "currency required"
                };
            },
            CURRENCY_INVALID: function(attribute) {
                return {
                    code: 5006,
                    attribute: attribute,
                    message: "currency invalid (must be ...)"
                };
            }
        }
    });
    return errors;
};