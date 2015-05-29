module.exports = function AdminValidate(errors) {

    var moment = require('moment');

    var adminValidate = {
        admin_username: function() {
            return this.regex(/^[a-zA-Z][a-zA-Z0-9_]{2,29}$/);
        },
        admin_password: function() {
            return this.regex(/^(?=[^\d_].*?\d)\w(\w|[!@#$%]){7,20}/);
        },
        admin_email: function() {
            return this.regex(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/);
        },
        admin_birthday: function() {
            var minAge = 18;
            var maxAge = 120;
            var minMoment = moment().subtract(maxAge, 'years');
            var maxMoment = moment().subtract(minAge, 'years');
            return this.dateInRange({
                min: minMoment,
                max: maxMoment
            });
        },
        admin_phone: function() {
            return this.regex(/^[a-zA-Z0-9]+$/);
        },
        admin_firstname: function() {
            return this.regex(/^[a-zA-Z0-9]+$/);
        },
        admin_lastname: function() {
            return this.regex(/^[a-zA-Z0-9]+$/);
        }
    };
    return adminValidate;
}