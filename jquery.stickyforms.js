/*
 * jQuery StickyForms Plugin
 * Authors: Ryan Schwartz & Joshua Giese (JQByte.com) and Forked by VELKYMX 
 * GitHub: https://github.com/velkymx/stickyforms
 * Examples and documentation at: http://www.jqbyte.com/StickyForms/documentation.php
 * Copyright (c) 2011 JQByte
 * Version: 1.0 (1-APR-2011)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */

(function($){
	
	// Set methods
	var methods = {
		
		// Initialize
		init : function(options){
			return this.each(function() {
				
				// Set defaults
				var settings = {
					'debug': 'false', // [true/false] Enable debugging
					'elementTypes'	: 'all', // [text,password,checkbox,radio,textarea,select-one,select-multipe,all] separate element types with comma separated values (default is all)
					'cookieLifetime': '1', // [integer] number of days of cookie lifetime
					'disableOnSubmit': 'true', // [true/false] disable submitting the form while the form is processing
					'excludeElementIDs': '', // [ID1,ID2] exclude element IDs with comma separated values
					'scope'			: 'single', // [single/global] should the values be sticky only on this form (single) or across all forms on site (default is global)
					'disableIfGetSet' : '', // [$_GET var] set to the $_GET var.  If this $_GET var is present, it will automatically disable the plugin.
					'hiddenVals' : 'true'	// true will save hidden values, whereas false will skip them
				};

				// Check for options
				if(options){ 
					$.extend(settings,options);
				}
				
				// Save settings
				$(this).data('SFSettings', settings);
				
				// Check if we should disable the plugin
				if(settings.disableIfGetSet != ""){
					var getVal = SFGet(settings.disableIfGetSet);
					if(getVal != ''){
						return this;
					}
				}

				// Bind form elements for process
				$(this).bind('submit', function() {
					$(this).StickyForm('process');
				});
				
				// Autofill data
				$(this).StickyForm('autoload');
				
				// Return this for chainability
				return this;
				
				// Get function
				function SFGet(q,s) {
				    s = (s) ? s : window.location.search;
				    var re = new RegExp('&amp;'+q+'=([^&amp;]*)','i');
				    return (s=s.replace(/^\?/,'&amp;').match(re)) ?s=s[1] :s='';
				}
				
			});
		},
		
		// Process form
		process : function(){
			return this.each(function(){				
				
				// Get settings
				var settings = $(this).data('SFSettings');
				
				// Disable the form if disableOnSubmit is enabled
				if(settings.disableOnSubmit == "true"){
					$('#'+this.id+' input[type=submit]').attr("disabled","disabled");
				}

				// Set cookie expiration
				var lifetime = settings.cookieLifetime;
				var today = new Date();
				var exp   = new Date(today.getTime()+lifetime*24*60*60*1000);
				
				// Alert if debugging
				if(settings.debug == "true"){
					alert("Cookie expiration: " + exp);
				}
				
				// Save data
				var n = this.length;
				for(var i = 0; i < n; i++){
				
					// Skip exclusions
					if(settings.excludeElementIDs.indexOf(this[i].id) != -1){
						continue;
					}

					// Skip the field types we do not need to save
					if(settings.elementTypes.indexOf(this[i].type) == -1 && settings.elementTypes != "all"){
						continue;
					}
					
					// Always skip buttons, hiddens, and submits
					if(this[i].type == "button" || this[i].type == "submit"){
						continue;
					}
			
					if(settings.hiddenVals == "false" && this[i].type == "hidden"){
						
						continue;
						
					}
					
					// Determine value
					if(this[i].type == "text" || this[i].type == "select-one" || this[i].type == "textarea" || this[i].type == "password" || this[i].type == "hidden" || this[i].type == "select-multiple"){
						var setVal = $(this[i]).val();
					}else if(this[i].type == "checkbox" || this[i].type == "radio"){
						var setVal = this[i].checked;
					}
					
					// Alert if debugging
					if(settings.debug == "true"){
						alert("Saving value: " + "(" + this[i].type + ") " + "[" + settings.scope + "] " + this[i].id + ": " + setVal);
					}
					
					// Save the cookie of current form value
					SFSetCookie("StickyForm_" + this[i].id, this.id + "||" + settings.scope + "||" + this[i].type + "||" + this[i].id + "||" + setVal, exp); 
				}
				
				
				// Reenable the form if disableOnSubmit is enabled
				if(settings.disableOnSubmit == "true"){
					$('#'+this.id+' input[type=submit]').attr("disabled",false);
				}
				
				// Return this for chainability
				return this;
				
				// Set cookie
				function SFSetCookie(name, value, expires) {
					document.cookie = name + "=" + escape(value) + "; path=/" + ((expires == null) ? "" : "; expires=" + expires.toGMTString());
				}
			});
		},
		
		// Autoload form
		autoload : function(){
			return this.each(function() {
				
				// Loop through form elements and load cookies (if found)
				var n = this.length;
				for(var i = 0; i < n; i++){
				
					// Get cookie
					var c = SFGetCookie("StickyForm_" + this[i].id);
					if(c != null){

						var split = c.split("||");
						var form = split[0];
						var scope = split[1];
						var type = split[2];
						var elementID = split[3];
						var val = split[4];
						
						// Validate scope
						if(scope != "global" && this.id != form){
							continue;
						}
						

						// Load text, select-one, password, and textarea values
						if(this[i].type == "text" || this[i].type == "select-one" || this[i].type == "select-multiple" || this[i].type == "textarea" || this[i].type == "password" || this[i].type == "hidden" ){
							this[i].value = val;
						}
						
						// Load select-multiple
						if((this[i].type == "select-multiple") && val != "null"){
						    var val_list = val.split(",");
						    var sm_id = "#" + $(this[i]).attr("id");
						    $(val_list).each(function(){
						        $(sm_id + " option[value="+this+"]").attr('selected','selected');
						    });

						}
						
						// Load checkboxes and radios
						if((this[i].type == "checkbox" || this[i].type == "radio") && val == "true"){
							this[i].checked = 'true';
						}
					}
				}
				
				// Return this for chainability
				return this;
				
				// Get the cookie
				function SFGetCookie(name){
					var cname = name + "=";               
					var dc = document.cookie;             
					    if (dc.length > 0) {              
					    begin = dc.indexOf(cname);       
					        if (begin != -1) {           
					        begin += cname.length;       
					        end = dc.indexOf(";", begin);
					            if (end == -1) end = dc.length;
					            return unescape(dc.substring(begin, end));
					        } 
					    }
					return null;
				}
				
			});
		}
	};
	
	// Declare plugin
	$.fn.StickyForm = function(method){  
		
		if (methods[method]) {
			return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
		}else if(typeof method === 'object' || ! method) {
			return methods.init.apply(this,arguments);
		}else{
			$.error('Method ' + method + ' does not exist on jQuery.StickyForm');
		}

	};
})(jQuery);

