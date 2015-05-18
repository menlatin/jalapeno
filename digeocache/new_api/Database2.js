module.exports = function DB(config) {

    var neo4j = require('neo4j');
    var ndb = new neo4j.GraphDatabase('http://localhost:7474');
    var Q = require('q');
    var _ = require('lodash');

    var Errors = require('./Errors.js');
    var errors = new Errors();

    var adminDB = require('./AdminDB.js')();
    // var userDB = require('./UserDB.js')();

    var db = {
        cypher: function(input) {
            console.log("----------------------");
            console.log("EXECUTING CYPHER QUERY");
            console.log(input);
            console.log("----------------------");
            var deferred = Q.defer();
            ndb.cypher(input, function(error, results) {
                if (error) deferred.reject(error);
                else deferred.resolve(results);
            });
            return deferred.promise;
        },
        successOneOrNone: function(results) {
            var response = {};
            var deferred = Q.defer();
            if (!results) {
                response.success = false;
                response.errors = [errors.DB_UNDEFINED_RESULT()];
                deferred.reject(response);
            } else if (results.length > 1) {
                response.success = false;
                response.errors = [errors.DB_EXPECTED_ONE_RESULT()];
                deferred.reject(response);
            } else {
                response.success = true;
                if(results.length == 0) {
                    response.data = results;
                }
                else {
                    response.data = results[0];
                }
                deferred.resolve(response);
            }
            return deferred.promise;
        },
        successTaken: function(results) {
            var response = {};
            var deferred = Q.defer();
            if (!results) {
                response.success = false;
                response.errors = [errors.DB_UNDEFINED_RESULT()];
                deferred.reject(response);
            } else if (results.length > 0) {
                response.success = true;
                response.taken = true;
                deferred.resolve(response);
            } else if (results.length == 0) {
                response.success = true;
                response.taken = false;
                deferred.resolve(response);
            } else {
                response.success = false;
                response.errors = [errors.DB_ERROR("unknown DB error")];
                deferred.reject(response);
            }
            return deferred.promise;
        },
        success: function(results) {
            var response = {};
            var deferred = Q.defer();
            if (!results) {
                response.success = false;
                response.errors = [errors.DB_UNDEFINED_RESULT()];
                deferred.reject(response);
            } else if (results.length == 0) {
                response.success = false;
                response.errors = [errors.DB_EMPTY_RESULT()];
                deferred.reject(response);
            } else {
                response.success = true;
                response.data = results;
                deferred.resolve(response);
            }
            return deferred.promise;
        },
        successDelete: function(results) {
            var response = {};
            var deferred = Q.defer();
            if (!results) {
                response.success = false;
                response.errors = [errors.DB_UNDEFINED_RESULT()];
                deferred.reject(response);
            } else {
                console.log("RESULTS successDeleteOne =", results);
                response.success = true;
                response.affected = results;
                deferred.resolve(response);
            }
            return deferred.promise;
        },
        error: function(error) {
            var response = {};
            var deferred = Q.defer();
            response.success = false;
            response.errors = [errors.DB_ERROR(error)];
            deferred.reject(response);
            return deferred.promise;
        }
    };

    // Merge Database Utility Functions for Models
    _.merge(db, adminDB);

    return db;
}