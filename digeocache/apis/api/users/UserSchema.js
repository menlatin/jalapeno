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

module.exports = function UserSchema(regex,dates) {

	// TODO: Waiting for Node-Neo4j API v2 update, including Schemas???
	var user_schema = [
		{attribute: "username", type: String, required: true, auto: false, test: regex.test.user.USERNAME },
		{attribute: "password", type: String, required: true, auto: false, test: regex.test.user.PASSWORD },
		{attribute: "email", type: String, required: true, auto: false, test: regex.test.user.EMAIL },
		{attribute: "birthday", type: Date, required: false, auto: false },
		{attribute: "phone", type: String, required: false, auto: false, test: regex.test.user.BIRTHDAY },
		{attribute: "firstname", type: String, required: false, auto: false, test: regex.test.user.FIRSTNAME },
		{attribute: "lastname", type: String, required: false, auto: false, test: regex.test.user.LASTNAME },
		{attribute: "created_on", type: Date, required: true, auto: true },
		{attribute: "updated_on", type: Date, required: true, auto: true }
	];
	return user_schema;
};