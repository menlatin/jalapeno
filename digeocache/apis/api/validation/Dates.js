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

module.exports = function Dates(errors) {

	function dateFromString(dateString) {
		var date = new Date(dateString);
		if(date && date.getFullYear()>0) {
			return date;
		}
		else {
			return null;
		}
	}

	function birthdayRangeTest() {
		return function(attribute, value) {
			var minAge = 18;
			var maxAge = 120;
			var minDate = new Date();
			var maxDate = new Date();
			var currentYear = minDate.getFullYear();
			minDate.setFullYear(currentYear-maxAge);
			maxDate.setFullYear(currentYear-minAge);

			var date = dateFromString(value);
			if (date !== null) {
				if((date < minDate) && (date > maxDate)) {
					return {valid:false,errors:errors.user.BIRTHDAY_INVALID(attribute,minAge,maxAge)};
					
				}
				else {
					return {valid:true,data:date.toISOString()};
				}
			}
			else {
				return {valid:false,errors:errors.form.DATE_INVALID(attribute)};
			}
		}
	}
	var dates = 
		{
			test: {
				admin: {
					// Admin Validation Regular Expressions
					BIRTHDAY: birthdayRangeTest()
				},
				user: {
					BIRTHDAY: birthdayRangeTest()
				},
				geocache: {

				}
			}
		};
	return dates;
}