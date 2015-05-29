module.exports = function GeocacheValidate(errors) {

    var moment = require('moment');

    var geocacheValidate = {
        geocache_title: function() {
            return this.regex(/^[a-zA-Z][a-zA-Z0-9_]{2,29}$/);
        },
        geocache_message: function() {
            return this.regex(/^(?=[^\d_].*?\d)\w(\w|[!@#$%]){7,20}/);
        },
        geocache_lat: function() {
            return this.latitude();
        },
        geocache_lng: function() {
            return this.longitude();
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
        geocache_query_filter: function(query, userSchema, db) {

            console.log("query = ", query);

            var response = {};
            var filter = {}
            var errorArray = [];
            // Must provide location to filter by distance
            if (query.distance && !query.location) {
                errorArray.push(errors.LOCATION_REQUIRED());
            }
            if (query.location) {
                var locationTest = this.coordinate()("?location=",query.location);
                if (locationTest.valid) {
                    filter.location = locationTest.data;
                } else {
                    errorArray.push(errors.QUERY_PARAM_INVALID("?location="));
                }
            }
            console.log("1");
            if (query.user) {
                var userTest = this.userID(query.user, userSchema, db);
                if (userTest.valid) {
                    filter.user = userTest.data;
                } else {
                    errorArray.push(errors.QUERY_PARAM_INVALID("?user="));
                }
            }
                        console.log("2");

            if (query.category) {
                var categoryTest = this.category()("?category=",query.category);
                if (categoryTest.valid) {
                    filter.category = categoryTest.data;
                } else {
                    errorArray.push(errors.QUERY_PARAM_INVALID("?category="));
                }
            }
            console.log("3");

            if (query.distance) {
                var distanceTest = this.distance()("?distance=",query.distance);
                if (distanceTest.valid) {
                    filter.distance = distanceTest.data;
                } else {
                    errorArray.push(errors.QUERY_PARAM_INVALID("?distance="));
                }
            }
            console.log("4");

            if (query.period) {
                var periodTest = this.dateRange()("?period=",query.period);
                if (periodTest.valid) {
                    filter.period = periodTest.data;
                } else {
                    errorArray.push(errors.QUERY_PARAM_INVALID("?period="));
                }
            }
            console.log("5");

            if (query.currency) {
                var currencyTest = this.geocache_currency()("?currency=", query.currency);
                if (currencyTest.valid) {
                    filter.currency = currencyTest.data;
                } else {
                    errorArray.push(errors.QUERY_PARAM_INVALID("?currency="));
                }
            }
                        console.log("6");


            if (query.amount) {
                var amountTest = this.geocache_amount()("?amount=", query.amount);
                if (amountTest.valid) {
                    filter.amount = amountTest.data;
                } else {
                    errorArray.push(errors.QUERY_PARAM_INVALID("?amount="));
                }
            }
                        console.log("7");

            if (query.visits) {
                var visitsTest = this.visits()("?visits=", query.visits);
                if (visitsTest.valid) {
                    filter.visits = visitsTest.data;
                } else {
                    errorArray.push(errors.QUERY_PARAM_INVALID("?visits="));
                }
            }

            if (errorArray.length > 0) {
                response.valid = false;
                response.errors = errorArray;
            } else {
                response.valid = true;
                response.data = filter;
            }

            return response;
        }
    };
    return geocacheValidate;
}