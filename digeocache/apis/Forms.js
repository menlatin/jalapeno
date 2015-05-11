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

module.exports = function Forms(render, error_pages) {
	var forms = {
		build: function (id, action, method, schema, data, errors, buttonValue) {
			var html =   "<form id='"+id+"' action='"+action+"' method='"+method+"'>";
			// Data and Errors Defined (Form Validation Failed)
			var retry = (data && errors);
			var htmlInput = "";
			var htmlError = "";
			schema.forEach(function(field) {
				if (!field.auto) {
					var retryValue = retry ? data[field.attribute] : null;
					switch (field.type) {
						case "date":
							var retryDateValue = "";
							if(retryValue) {
								var retryDate = new Date(retryValue);
								var retryMonth = retryDate.getMonthName();
								var retryDay = retryDate.getDate();
								var retryYear = retryDate.getFullYear();
								var retryDateValue = retryMonth + " " + retryDay + ", " + retryYear; 
							}

							htmlInput = forms.input("text", field.attribute, field.attribute, retryDateValue, "datepicker", "true");
							break;
						case "text":
							htmlInput = forms.input("text", field.attribute, field.attribute, retryValue, null, null);
							break;
						case "password":
							htmlInput = forms.input("password", field.attribute, field.attribute, retryValue, null, null);
							break;
					}
					if (retry) {
						function byAttribute(attribute) {
							return function(element) {
								return element.attribute == attribute;
							}
						}
						var fieldErrors = errors.filter(byAttribute(field.attribute));
						fieldErrors.forEach(function(error) {
							htmlError = forms.error(error.message); 
						});
					}
					html += "<p>"+htmlInput+htmlError+"</p>";
					htmlInput = "";
					htmlError = "";
				}
			});
			html += forms.submitButton(buttonValue);
			html += "</form>";
			return html;
		},
		input: function (type, placeholder, name, value, clazz, readonly) {
				var html = "<input ";
				html += " type='"+type+"' "; 
				html += " placeholder='"+placeholder+"' ";
				html += " name='"+name+"' ";
				if (value) { html += " value='"+value+"' "; }
				if (clazz) { html += " class='"+clazz+"' "; }
				if (readonly) { html += " readonly='"+readonly+"' "; }
				html += ">";
				return html;
		},
		error: function(message) {
			return message ? "<strong class='error'>"+message+"</strong>" : "";
		},
		submitButton: function(value) {
			var def = "Submit";
			return "<p><input type='submit' value='"+(value ? value : def)+"'></p>";
		},

		renderForm: function *(next) {
			if(this.req.formSchema == undefined) {
				this.req.errorMessage = "Form cannot be rendered without knowing the schema.";
				return yield error_pages.generic;
			}
			if(this.req.formAction == undefined) {
				this.req.errorMessage = "Form cannot be rendered without a form action.";
				return yield error_pages.generic;
			}
			// Form Validation Failed
			if(this.req.formData != undefined && this.req.formErrors != undefined) {
				this.status = 400;
				this.body = yield render(this.req.formName, 
					{ 
						locals: {
							form: forms.build(
								this.req.formName, 
								this.req.formAction, 
								"post", 
								this.req.formSchema, 
								this.req.formData, 
								this.req.formErrors,
								this.req.formButtonValue + " Re-Try"
							)
						}
					} 
				);
			}
			// Fresh Form
			else {
				this.body = yield render(this.req.formName, 
					{ 
						locals: {
							form: forms.build(
								this.req.formName, 
								 this.req.formAction, 
								 "post", 
								 this.req.formSchema, 
								 null, 
								 null,
								 this.req.formButtonValue
							)
						}
					}
				);
			}
		}
	}
	return forms;
}
