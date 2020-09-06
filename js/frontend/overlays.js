/* ----------------------------------------------------------------------------------------------------------------------- */
/* Modal Iframe AJAX Content --------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------------------------- */
$(".modal-iframe-ajax-content").click(function() {
	var theUrl = $(this).attr("href");
	var theModalWidth = $(this).attr("rel").split("|")[0];
	var theModalHeight = $(this).attr("rel").split("|")[1];
	var timestamp = new Date().getTime();

	var iframe = '<iframe src="'+theUrl+'&no_template=1" height="'+theModalHeight+'" width="'+theModalWidth+'" style="height:'+theModalHeight+'px;width:'+theModalWidth+'px;"></iframe>';

	showSoSimpleOverlay(iframe);

	return false;
});


/* ----------------------------------------------------------------------------------------------------------------------- */
/* SoSimple Overlays ----------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------------------------- */
function showSoSimpleOverlay(content,id) {
	if(!id) {
		$(".sosimple-underlay").remove();
		$(".sosimple-overlay").remove();
	}

	$("body").append('<div class="sosimple-underlay"'+(id?' id="'+id+'-underlay"':'')+'></div>');
	$("body").append('<div class="sosimple-overlay"'+(id?' id="'+id+'"':'')+'><a href="#" class="sosimple-overlay-close"></a>'+content+'</div>');

	var sosimpleoverlay = (id?$("#"+id):$(".sosimple-overlay"));

	$(window).resize(function() {
		var newtop = $(window).scrollTop()+($(window).height()/2)-($(sosimpleoverlay).height()/2)-80;
		if(newtop<=0) newtop=20;
		$(sosimpleoverlay).css({
			"display":"block",
			"top":newtop+"px",
			"width":$(sosimpleoverlay).width()+"px",
			"margin-left":"-"+($(sosimpleoverlay).width()/2)-15+"px"
		});
	}).resize();

	if($(sosimpleoverlay).offset().top-$(window).scrollTop()<0) {
		$(sosimpleoverlay).css({"top":$(window).scrollTop()+20+"px"});
	}
	$(".sosimple-underlay").fadeIn("fast");

	$(sosimpleoverlay).find(".sosimple-overlay-close").click(function() {
		closeSoSimpleOverlay(id);
		return false;
	});

	$('body').trigger('sosimple-overlay-opened');

	$(".sosimple-underlay").click(function() {
		closeSoSimpleOverlay(id);
	});

	$(document).keydown(function(e) {
		if(e.keyCode==27) {
			closeSoSimpleOverlay(id);
		}
	});
}

function closeSoSimpleOverlay(id) {
	if(id && $('.sosimple-overlay').length > 1) {
		$("#"+id+'-underlay').fadeOut("fast",function() { $(this).remove(); });
		$("#"+id).fadeOut("fast",function() { $(this).remove(); });
	} else {
		$(".sosimple-underlay").last().fadeOut("fast",function() { $(this).remove(); });
		$(".sosimple-overlay").last().fadeOut("fast",function() { $(this).remove(); });
	}

	$('body').trigger('sosimple-overlay-closed');
}