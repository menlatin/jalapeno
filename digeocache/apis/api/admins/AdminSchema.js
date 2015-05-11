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

module.exports = function AdminSchema(regex,dates) {

	// TODO: Waiting for Node-Neo4j API v2 update, including Schemas?
	var admin_schema = [
		{attribute: "username", 	type: "text", 		required: true, 	auto: false, test: regex.test.admin.USERNAME },
		{attribute: "password", 	type: "password", 	required: true, 	auto: false, test: regex.test.admin.PASSWORD },
		{attribute: "email", 		type: "text", 		required: true, 	auto: false, test: regex.test.admin.EMAIL },
		{attribute: "birthday", 	type: "date", 		required: false, 	auto: false, test: dates.test.admin.BIRTHDAY },
		{attribute: "phone", 		type: "text", 		required: false, 	auto: false, test: regex.test.admin.PHONE },
		{attribute: "firstname", 	type: "text", 		required: false, 	auto: false, test: regex.test.admin.FIRSTNAME },
		{attribute: "lastname", 	type: "text", 		required: false, 	auto: false, test: regex.test.admin.LASTNAME },
		{attribute: "created_on", 	type: "date", 		required: false, 	auto: true },
		{attribute: "updated_on", 	type: "date", 		required: true, 	auto: true },
		{attribute: "login_on",		type: "date",		required: false,	auto: true }
	];
	return admin_schema;
};