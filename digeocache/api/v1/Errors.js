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
                code: 1001,
                message: "Unauthorized to view this resource."
            };
        },
        UNPRIVILEGED: function(user) {
            return {
                code: 1002,
                message: user+" unprivileged to access this resource."
            };
        },
        UNSUPPORTED: function() {
            return {
                code: 1003,
                message: "Unsupported API operation."
            };
        },
        UNKNOWN_ERROR: function(context) {
            return {
                code: 1004,
                message: "Unknown error: " + context
            };
        },
        /*
            Database Errors
        */
        NEO4J_ERROR: function(ctx) {
            return {
                code: 2001,
                message: "Neo4j error" + ((ctx) ? ": "+ctx : "")
            }
        },
        NEO4J_CONNECTION_ISSUE: function() {
            return {
                code: 2002,
                message: "Neo4j connection issue"
            }
        },
        NEO4J_MALFORMED_QUERY: function() {
            return {
                code: 2003,
                message: "Neo4j malformed query"
            }
        },
        NEO4J_CONSTRAINT_VIOLATION: function() {
            return {
                code:2004,
                message: "Neo4j constraint violation"
            }
        },
        NEO4J_EMPTY_RESULT: function() {
            return {
                code: 2005,
                message: "Neo4j query result was empty"
            }
        },
        NEO4J_EXPECTED_RESULT: function() {
            return {
                code: 2006,
                message: "Neo4j query response expected one or more results"
            }
        },
        NEO4J_EXPECTED_ONE_RESULT: function() {
            return {
                code: 2007,
                message: "Neo4j query response expected only one result and found many"
            }
        },
        NEO4J_UNDEFINED_RESULT: function() {
            return {
                code: 2008,
                message: "Neo4j query result was undefined"
            }
        },
        /*
            Validation Errors
        */
        LOGIN_FAILURE: function(ctx) {
            return {
                code: 3001,
                message: "bad credentials ::: "+ctx
            };
        },
        LOGOUT_FAILURE: function() {
            return {
                code: 3002,
                message: "logout failure"
            };
        },
        UNIDENTIFIABLE: function(id) {
            return {
                code: 3003,
                message: "unidentifiable from: " + id
            }
        },
        ATTRIBUTE_TEST_REQUIRED: function(attribute) {
            return {
                code: 3004,
                message: attribute + " mandates a test"
            };
        },
        ATTRIBUTE_REQUIRED: function(attribute) {
            return {
                code: 3005,
                attribute: attribute,
                message: attribute + " required"
            };
        },
        ATTRIBUTE_INVALID: function(attribute) {
            return {
                code: 3006,
                attribute: attribute,
                message: attribute + " invalid"
            };
        },
        USERNAME_TAKEN: function(attribute) {
            return {
                code: 3007,
                attribute: attribute,
                message: "username taken"
            };
        },
        EMAIL_TAKEN: function(attribute) {
            return {
                code: 3008,
                attribute: attribute,
                message: "email taken"
            };
        },
        UPDATE_EMPTY: function() {
            return {
                code: 3009,
                message: "update request empty"
            };
        },
        /* Geocache Validation Errors */
        LOCATION_REQUIRED: function() {
            return {
                code: 4001,
                message: "location required for distance filter"
            };
        },
        RANGE_REQUIRED: function() {
            return {
                code: 4002,
                message: "range must be specified with location filter"
            };
        },
        QUERY_PARAM_INVALID: function(param) {
            return {
                code: 4003,
                message: "query param invalid: "+param
            };
        }
    });
    return errors;
};