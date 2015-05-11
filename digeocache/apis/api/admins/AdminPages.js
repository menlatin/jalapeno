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

module.exports = function AdminPages(db, forms, views, admin_schema, error_pages) {
	var admin_pages = {
		create: function *(next) {
			this.req.formName = "admin_create";
			this.req.formAction = "/api/v1/admins";
			this.req.formSchema = admin_schema;
			this.req.formButtonValue = "Create";
			yield forms.renderForm;
		},
		//TODO: edit logic / page handling
		edit: function *(next) {
			this.req.formName = "admin_edit";
			this.req.formAction = "";
			this.req.formSchema = admin_schema;
			this.req.formButtonValue = "Edit";


			var results = yield db.util.admins_all();
			if (!results) {
				this.req.errorMessage = "Issues retrieving admin data for editing.";
				return yield error_pages.generic; 
			}
			else {
				// console.log("results = ", results);
				this.req.data = JSON.stringify(results);
				yield forms.renderForm;
			}
		},
		//TODO: destroy logic / page handling
		destroy: function *(next) {
			this.req.formName = "admin_destroy";
			this.req.formAction = "";
			this.req.formSchema = admin_schema;
			this.req.formButtonValue = "Delete";
			yield forms.renderForm;
		},
		view: function *(next) {
			console.log("this.req.user = ",this.req.user);
			this.req.viewName = "admin_view";
			this.req.viewSchema = admin_schema;
			yield views.renderView;
		}
	};
	return admin_pages;
};