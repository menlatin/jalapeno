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

module.exports = function Views(render, error_pages) {
	var views = {
		build: function(data, schema) {
			// console.log("data in view = ", JSON.stringify(data, null, 4));
			var html = "<table>";
			html += "<thhead>";
			schema.forEach(function(field) {
				html += "<th>" + field.attribute + "</th>";
			});
			html += "</thead>";
			data.forEach(function(entity) {
				html += "<tbody><tr>";
				schema.forEach(function(field) {
					if(field.attribute in entity) {
						html += "<td>" + entity[field.attribute] + "&nbsp;</td>";
					}
					else {
						html += "<td>&nbsp;</td>";
					}
				});
				html += "</tr></tbody>";
			});
			html += "</html>";
			return html;
		},
		renderView: function *(next) {

			if(this.req.viewName == undefined) {
				return yield error_pages.generic;
			}

			this.body = yield render(this.req.viewName, 
				{
					locals: {
						table: views.build(this.req.viewData, this.req.viewSchema)
					}
				}
			);

		}
	}
	return views;
}
