{% autoescape false %}
var adminsJSON = "{{ data|addslashes }}";
{% endautoescape %}

var admins = JSON.parse(adminsJSON);

var adminsSelect = $("#admin_select");
var adminPutForm = $("#admin_edit");

// No Admins Found in Database
if(admins.length == 0) {
	adminPutForm.hide();
	adminsSelect.append($("<option />").val("DNE").text("No admins in database."));
}
// Admins Exist
else {
	// Create Drop-Down  Options for Admins Edit Selection
	$.each(admins, function(i) {
		adminsSelect.append($("<option />").val(this.id).text(this.id+": "+this.firstname+" "+this.lastname+" ("+this.username+")"));
	});

	// Detect When Selected Admin Changes and Update Edit Fields With Current Data
	adminsSelect.on("change", function() {
		var id = adminsSelect.find("option:selected").val();
		console.log(id);
		var adminGrep = $.grep(admins, function(a){ return a.id == id; });
		var admin = adminGrep[0];
		console.log(admin);

		// Iterate Through Form Inputs and Prefill w/Admin Data
		adminPutForm.find("input[type=text], input[type=password]").each(function() {
			if($(this)[0].name in admin) {
				var value = admin[$(this)[0].name];

				// If Data Field is Empty, Clear the Form Input Field
				if(value === "") {
					$(this).val(value);
					return;
				}

				// Take ISO8601 String Date and Format as JQuery Datepicker Expects
				if($(this).hasClass("datepicker") ){
					var dateParts = value.match(/\d+/g);
					var date = new Date(dateParts[0], dateParts[1]-1, dateParts[2], dateParts[3], dateParts[4], dateParts[5]);
					// March 3, 2015
					var dateFormatted = date.getMonthName() + " " + date.getDate() + ", " + date.getFullYear();
					value = dateFormatted;
				}

				$(this).val(value);
			}
		});

		// Submit Edited Admin Action (PUT)
		adminPutForm.submit(function() {

		  var data = {};
		  adminPutForm.serializeArray().map(function(x){data[x.name] = x.value;});

		  alert(JSON.stringify(data,null,4));

		    var url = "/api/admins"; // the script where you handle the form input.

		    // $.ajax({
		    //        type: "PUT",
		    //        url: url,
		    //        data: $("#idForm").serialize(), // serializes the form's elements.
		    //        success: function(data)
		    //        {
		    //            alert(data); // show response from the php script.
		    //        }
		    //      });

		    return false; // avoid to execute the actual submit of the form.
		});
	});
}



