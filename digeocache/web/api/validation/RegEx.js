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

module.exports = function RegEx(errors) {

	function regexTest(condition) {
		return function(attribute, value) {
			var errorArray = [];
			// Loop Through And Test All Conditions for This Value Validation
			var valid = condition.regex.test(value);
			if(!valid) {
				errorArray.push(condition.error(attribute));
				return  { valid: false, errors: errorArray };
			}
			else {
				return  { valid: true, data: value };
			}
		};
	}

	var regex = 
		{
			test: {
				admin: {
					// Admin Validation Regular Expressions
					USERNAME: regexTest(
						{ 
							regex: /^[a-zA-Z0-9][a-zA-Z0-9_]{2,29}$/, 
							error: errors.user.USERNAME_INVALID 
						}
					),
					PASSWORD: regexTest(
						{ 
							regex: /^(?=[^\d_].*?\d)\w(\w|[!@#$%]){7,20}/, 
							error: errors.user.PASSWORD_INVALID 
						}
					),
					EMAIL: regexTest(
						{ 
							regex: /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/, 
							error: errors.user.EMAIL_INVALID 
						}
					),
					PHONE: regexTest(
						{ 
							regex: /^[a-zA-Z0-9]+$/, 
							error: errors.user.PHONE_INVALID 
						}
					),
					FIRSTNAME: regexTest(
						{ 
							regex: /^[a-zA-Z0-9]+$/, 
							error: errors.user.FIRSTNAME_INVALID }
					),
					LASTNAME: regexTest(
						{ 
							regex: /^[a-zA-Z0-9]+$/, 
							error: errors.user.LASTNAME_INVALID }
					)
				},
				user: {
					// User Validation Regular Expressions
					USERNAME: regexTest(
						{ 
							regex: /^[a-zA-Z0-9][a-zA-Z0-9_]{2,29}$/, 
							error: errors.user.USERNAME_INVALID 
						}
					),
					PASSWORD: regexTest(
						{ 
							regex: /^(?=[^\d_].*?\d)\w(\w|[!@#$%]){7,20}/, 
							error: errors.user.PASSWORD_INVALID 
						}
					),
					EMAIL: regexTest(
						{ 
							regex: /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/, 
							error: errors.user.EMAIL_INVALID 
						}
					),
					PHONE: regexTest(
						{ 
							regex: /^[a-zA-Z0-9]+$/, 
							error: errors.user.PHONE_INVALID 
						}
					),
					FIRSTNAME: regexTest(
						{ 
							regex: /^[a-zA-Z0-9]+$/, 
							error: errors.user.FIRSTNAME_INVALID }
					),
					LASTNAME: regexTest(
						{ 
							regex: /^[a-zA-Z0-9]+$/, 
							error: errors.user.LASTNAME_INVALID }
					)
				},
				geocache: {
					// Geocache Validation Regular Expressions
					TITLE: regexTest(
						{ 
							regex: /^[a-zA-Z0-9]+$/, 
							error: errors.geocache.TITLE_INVALID 
						}
					),
					MESSAGE: regexTest(
						{ 
							regex: /^[a-zA-Z0-9]+$/, 
							error: errors.geocache.MESSAGE_INVALID 
						}
					),
					CURRENCY: regexTest(
						{ 
							regex: /^[a-zA-Z0-9]+$/, 
							error: errors.geocache.CURRENCY_INVALID 
						}
					)
				}
			}
		};
	
	return regex;
}
