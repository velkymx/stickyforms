stickyforms
===========

Requires jQuery core

This is a branch of the dead project for stickyforms. http://www.jqbyte.com/StickyForms/

Options

'debug': 'false', // [true/false] Enable debugging

'elementTypes'	: 'all', // [text,password,checkbox,radio,textarea,select-one,select-multipe,all] separate element types with comma separated values (default is all)

'cookieLifetime': '60', // [integer] number of days of cookie lifetime

'disableOnSubmit': 'true', // [true/false] disable submitting the form while the form is processing

'excludeElementIDs': '', // [ID1,ID2] exclude element IDs with comma separated values

'scope'			: 'single', // [single/global] should the values be sticky only on this form (single) or across all forms on site (default is global)

'disableIfGetSet' : '', // [$_GET var] set to the $_GET var.  If this $_GET var is present, it will automatically disable the plugin.

'hiddenVals' : 'true'	// true will save hidden values, whereas false will skip them

Usage:

$('#reportId').StickyForm({
	'scope'	: 'single',
	'hiddenVals' : 'false'
});		