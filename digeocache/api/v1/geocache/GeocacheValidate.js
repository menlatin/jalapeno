module.exports = function GeocacheValidate() {

    var moment = require('moment');

    var geocacheValidate = {
        geocache_title: function() {
            return this.regex(/^[a-zA-Z][a-zA-Z0-9_]{2,29}$/);
        },
        geocache_message: function() {
            return this.regex(/^(?=[^\d_].*?\d)\w(\w|[!@#$%]){7,20}/);
        },
        geocache_lat: function() {
            return this.regex(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/);
        },
        geocache_lng: function() {
            return this.regex(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/);
        },
        geocache_currency: function() {
            return this.regex(/(FLAP|DOGE|BITCOIN)/);
        },
        geocache_amount: function() {
            return this.doubleRange({
                min: 0.05,
                max: 5000
            });
        },
        geocache_is_physical: function() {
            return this.bool();
        },
        geocache_delay: function() {
            // Hours Between 1-360, excluding 0, padded 0s OK
            return this.regex(/^0*(?:[1-9][0-9]?|360)$/);
        },
        // * Filter Validations * //
        geocache_querystring: function(querystring,userSchema,db) {

            var tests = {};

            var locationQuery = this.getQueryVariable(querystring, "location");
            var location_test = this.coordinate(locationQuery);
            tests.location = location_test;
            var userQuery = this.getQueryVariable(querystring, "user");
            var user_test = this.userID(userQuery,userSchema,db);
            tests.user = user_test;

            var categoryQuery = this.getQueryVariable(querystring, "category");
            var category_test = this.category(categoryQuery);
            tests.category = category_test;
            
            var distanceQuery = this.getQueryVariable(querystring, "distance");
            var distance_test = this.distance(distanceQuery);
            tests.distance = distance_test;

            var periodQuery = this.getQueryVariable(querystring, "period");
            var period_test = this.period(periodQuery);
            tests.period = period_test;


            // Check URL querystring for filter


            return tests;
        }
    };
    return geocacheValidate;
}