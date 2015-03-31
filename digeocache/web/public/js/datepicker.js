$(function() {
	var now = new Date();
	var nowYear = now.getFullYear();
	var past25Year = nowYear - 25;
	var past25YearString = "January 01, "+past25Year.toString();
	$( ".datepicker" ).datepicker( { "dateFormat": "MM d', 'yy", "defaultDate": past25YearString, "changeYear": true, "changeMonth": true, "yearRange": "-121:-17" } );
});