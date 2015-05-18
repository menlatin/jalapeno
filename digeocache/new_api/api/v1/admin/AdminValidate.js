module.exports = function AdminValidate(errors) {
    var adminValidate = {
        admin_username: function() {
            return this.regex({
                regex: /^[a-zA-Z][a-zA-Z0-9_]{2,29}$/,
                error: errors.user.USERNAME_INVALID
            });
        },
        admin_password: function() {
            return this.regex({
                regex: /^(?=[^\d_].*?\d)\w(\w|[!@#$%]){7,20}/,
                error: errors.user.PASSWORD_INVALID
            });
        },
        admin_email: function() {
            return this.regex({
                regex: /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/,
                error: errors.user.EMAIL_INVALID
            });
        },
        admin_birthday: function() {
            var minAge = 18;
            var maxAge = 120;
            var minMoment = moment().subtract(maxAge, 'years');
            var maxMoment = moment().subtract(minAge, 'years');
            return this.dateRange({
                min: minMoment,
                max: maxMoment,
                error: errors.user.DATE_INVALID
            });
        },
        admin_phone: function() {
            return this.regex({
                regex: /^[a-zA-Z0-9]+$/,
                error: errors.user.PHONE_INVALID
            })
        },
        admin_firstname: function() {
            return this.regex({
                regex: /^[a-zA-Z0-9]+$/,
                error: errors.user.FIRSTNAME_INVALID
            })
        },
        admin_lastname: function() {
            return this.regex({
                regex: /^[a-zA-Z0-9]+$/,
                error: errors.user.LASTNAME_INVALID
            })
        }
    };
    return adminValidate;
}