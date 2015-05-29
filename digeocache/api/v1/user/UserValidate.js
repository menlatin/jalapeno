module.exports = function UserValidate(errors) {

    var moment = require('moment');

    var userValidate = {
        user_username: function() {
            return this.regex(/^[a-zA-Z][a-zA-Z0-9_]{2,29}$/);
        },
        user_password: function() {
            return this.regex(/^(?=[^\d_].*?\d)\w(\w|[!@#$%]){7,20}/);
        },
        user_email: function() {
            return this.regex(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/);
        },
        user_birthday: function() {
            var minAge = 18;
            var maxAge = 120;
            var minMoment = moment().subtract(maxAge, 'years');
            var maxMoment = moment().subtract(minAge, 'years');
            return this.dateInRange({
                min: minMoment,
                max: maxMoment
            });
        },
        user_phone: function() {
            return this.regex(/^[a-zA-Z0-9]+$/);
        },
        user_firstname: function() {
            return this.regex(/^[a-zA-Z0-9]+$/);
        },
        user_lastname: function() {
            return this.regex(/^[a-zA-Z0-9]+$/);
        }
    };
    return userValidate;
}