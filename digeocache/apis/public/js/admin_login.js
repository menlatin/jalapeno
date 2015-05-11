// Admin Login Attempt
$("#admin_login").submit(function() {

  // Hit POST HTTP Method for Admin Login
  var url = "/login/admins";

  $.ajax({
    type: "POST",
    url: url,
    data: $("#admin_login").serialize(), // serializes the form's elements.
    success: function(data)
    {
      // Check Browser Support for localStorage
      if (typeof(Storage) != "undefined") {
          // Store JWT accessToken
          if (data.token) {
            localStorage.setItem("accessToken", data.token);
            $(location).attr('href','/admins');
          }
          else {
            console.log('got here');
            $(location).attr('href','/login/admins');
          }
         
          // Retrieve
          document.getElementById("result").innerHTML = localStorage.getItem("accessToken");
      } 
      else {
          document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
      }
    }
  });

    return false; // avoid to execute the actual submit of the form.
});