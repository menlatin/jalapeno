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
                min:0.05,
                max:5000
            })
        },
        geocache_is_physical: function() {
            return this.bool();
        },
        geocache_delay: function() {
            // Hours Between 1-360, excluding 0, padded 0s OK
            return this.regex(/^0*(?:[1-9][0-9]?|360)$/);
        }
    };
    return geocacheValidate;
}