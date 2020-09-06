/* ---------------------------------------------------------------------------------------------------------------------- */
/* Alerts --------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------- */
$().ready(function() {
	if($(".thealert").length) {
		$(".thealert").hide();
		$(".alert-inside").css({"opacity":"0"});
		$(".thealert").delay(250).slideDown("slow",function() {
			$(".alert-inside").fadeTo("fast",1);
		});

		if($(".thealert").hasClass("good-alert")) {
			setTimeout("closeAlert()",4000);
		}
	}

	$(document).on('click',".close-it",function() {
		closeAlert();
		return false;
	});
});

function closeAlert() {
	$(".alert-inside").fadeTo("fast",0,function() {
		$(".thealert").slideUp("slow");
	});
}

var theout;
function showAlert(msg,type) {
	clearTimeout(theout);

	thealert = '\
		<div class="'+type+'-alert thealert fixed">\
			<div class="alert-inside">\
				<a href="#" class="'+type+'-alert-close close-it minus"><span><span>x</span></span></a>\
				'+msg+'\
			</div>\
		</div>\
	';

	$(".thealert").remove();
	$("body").prepend(thealert);

	$(".thealert").hide();
	$(".alert-inside").css({"opacity":"0"});
	$(".thealert").delay(250).slideDown("slow",function() {
		$(".alert-inside").fadeTo("fast",1);
	});


	if(type="good") {
		theout = setTimeout("closeAlert()",4000);
	}
}
