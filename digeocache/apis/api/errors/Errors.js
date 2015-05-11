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
	var errors = Object.freeze(
		{
			UNKNOWN_ERROR: function(context) {
				return {
					code: 1001,
					message: "Unknown error: "+context
				};
			},
			DB_ERROR: function(context) {
				return {
					code: 1002,
					message: "DB error: "+context
				}
			},
			form: {
			    REQUIRES_ATTRIBUTE_TEST: function(attribute) {
			        return {
			            code: 2001,
			            message: attribute + " mandates a test function for \
			            			validation"
			        };
			    },
			    REQUIRES_ATTRIBUTE: function(attribute) {
			        return {
			            code: 2002,
			            attribute: attribute,
			            message: attribute + " required"
			        };
			    },
			    DATE_INVALID: function(attribute) {
			        return {
			            code: 2003,
			            attribute: attribute,
			            message: attribute + " is not a valid date string"
			        };
			    }
			},
			// Login Related Errors
			login: {
			    USERNAME_NOT_FOUND: function(attribute) {
			    	return {
			    		code: 3001,
			    		attribute: attribute,
			    		message: "username or email not found"
			    	};
			    },
			    PASSWORD_INCORRECT: function(attribute) {
			    	return {
			    		code: 3002,
			    		attribute: attribute,
			    		message: "the password you enterd is incorrect"
			    	};
			    }
			},
			// Admin/User POST Validation Errors
			user: {
				ID_NOT_FOUND: function() {
					return {
						code: 4001,
						message: "user not found for this id"
					}
				},
				USERNAME_NOT_FOUND: function() {
					return {
						code: 4002,
						message: "username not found"
					}
				},
				EMAIL_NOT_FOUND: function() {
					return {
						code: 4003,
						message: "email not found"
					}
				},
			    USERNAME_REQUIRED: function(attribute) {
			        return {
			            code: 4001,
			            attribute: attribute,
			            message: "username required"
			        };
			    },
			    USERNAME_INVALID: function(attribute) {
			        return {
			            code: 4002,
			            attribute: attribute,
			            message: "username must be 3-30 alphanumeric and \
			            			underscore characters and cannot start or \
			            			end with an underscore"
			        };
			    },
			    USERNAME_TAKEN: function(attribute) {
			    	return {
			    		code: 4003,
			    		attribute: attribute,
			    		message: "username taken"
			    	};
			    },
			    PASSWORD_REQUIRED: function(attribute) {
			        return {
			            code: 4004,
			            attribute: attribute,
			            message: "password required"
			        };
			    },
			    PASSWORD_INVALID: function(attribute) {
			        return {
			            code: 4005,
			            attribute: attribute,
			            message: "password must be 8-20 alphanumeric and \
			            			special characters (!, @, #, $, %), cannot \
			            			start with a digit, underscore or special \
			            			character, and must contain at least 1 \
			            			digit"
			        };
			    },
			    EMAIL_REQUIRED: function(attribute) {
			        return {
			            code: 4006,
			            attribute: attribute,
			            message: "email required"
			        };
			    },
			    EMAIL_INVALID: function(attribute) {
			        return {
			            code: 4007,
			            attribute: attribute,
			            message: "please enter a valid email"
			        };
			    },
			    EMAIL_TAKEN: function(attribute) {
			    	return {
			    		code: 4008,
			    		attribute: attribute,
			    		message: "email taken"
			    	};
			    },
			    BIRTHDAY_INVALID: function(attribute, minAge, maxAge) {
			        return {
			            code: 4009,
			            attribute: attribute,
			            message: "you must be " + minAge + "-" + maxAge
			        };
			    },
			    PHONE_INVALID: function(attribute) {
			        return {
			            code: 4010,
			            attrib4te: attribute,
			            message: "phone invalid (must be ...)"
			        };
			    },
			    FIRSTNAME_INVALID: function(attribute) {
			        return {
			            code: 4011,
			            attribute: attribute,
			            message: "firstname invalid (must be ...)"
			        };
			    },
			    LASTNAME_INVALID: function(attribute) {
			        return {
			            code: 4012,
			            attribute: attribute,
			            message: "lastname invalid (must be ...)"
			        };
			    }
			},
			// Geocache POST Validation Errors
			geocache: {
			    TITLE_REQUIRED: function(attribute) {
			        return {
			            code: 5001,
			            attribute: attribute,
			            message: "title required"
			        };
			    },
			    TITLE_INVALID: function(attribute) {
			        return {
			            code: 5002,
			            attribute: attribute,
			            message: "title invalid (must be ...)"
			        };
			    },
			    MESSAGE_REQUIRED: function(attribute) {
			        return {
			            code: 5003,
			            attribute: attribute,
			            message: "message required"
			        };
			    },
			    MESSAGE_INVALID: function(attribute) {
			        return {
			            code: 5004,
			            attribute: attribute,
			            message: "message invalid (must be ...)"
			        };
			    },
			    CURRENCY_REQUIRED: function(attribute) {
			        return {
			            code: 5005,
			            attribute: attribute,
			            message: "currency required"
			        };
			    },
			    CURRENCY_INVALID: function(attribute) {
			        return {
			            code: 5006,
			            attribute: attribute,
			            message: "currency invalid (must be ...)"
			        };
			    }
			}
		}
	);
	return errors;
};