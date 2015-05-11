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

module.exports = function GeocacheSchema(regex,dates) {

	// TODO: Waiting for Node-Neo4j API v2 update, including Schemas???
	var geocache_schema = [
		{attribute: "title", type: String, required: true, test: regex.test.geocache.TITLE },
		{attribute: "message", type: String, required: true, test: regex.test.geocache.MESSAGE },
		{attribute: "lat", type: Number, required: true },
		{attribute: "lng", type: Number, required: true },
		{attribute: "currency", type: String, required: true, test: regex.test.geocache.CURRENCY },
		{attribute: "amount", type: Number, required: true },
		{attribute: "is_physical", type: Boolean, required: true },
		{attribute: "delay", type: Number, required: true },
		{attribute: "drop_count", type: Number, required: true, auto: true },
		{attribute: "dropped_on", type: Date, required: true, auto: true }
	];
	return geocache_schema;
};