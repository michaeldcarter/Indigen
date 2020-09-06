var is_full_screen_mode = 0;
var zoom_width = 2000;

if(has_audio) {
	if($('.bb-item').first().find('audio').length) {
		var item = $('.bb-item').first();
		$(item).find('audio').mediaelementplayer();
		$(item).addClass('audio-added');

		if($(item).hasClass('autoplay_audio')) {
			$(item).find('audio').first()[0].player.play();
		}
		$(item).addClass('triggered');
		setTimeout(function() { $(item).removeClass('triggered'); },1500);
	}
}

$('#bb-nav-prev').hide();
$('.nav-prev').hide();

var Page = (function() {
	var cur_index = 0;
	var config = {
			$bookBlock : $( '#bb-bookblock' ),
			$navNext : $( '.nav-next' ),
			$navPrev : $( '.nav-prev' )
		},
		init = function() {
			config.$bookBlock.bookblock( {
				speed : 600,
				shadowSides : 0.8,
				shadowFlip : 0.7,
				transitionType: transitionType,
				onEndFlip: function(old, page, isLimit) {
					var item = $(".bb-item").eq(page);
					$('.current-slide').removeClass('current-slide');
					$(item).addClass('current-slide');
					cur_index = $(item).index();
					$("#page-count").val(cur_index+1);
					window.location.hash = cur_index+1;

					if(cur_index==0) {
						$('#bb-nav-prev').stop(1,1).fadeOut('fast');
						$('.nav-prev').stop(1,1).fadeOut('fast');
					} else {
						$('#bb-nav-prev').stop(1,1).fadeIn('fast');
						$('.nav-prev').stop(1,1).fadeIn('fast');
					}

					if(cur_index+1 >= parseInt($("#total-pages").html())) {
						$('#bb-nav-next').stop(1,1).fadeOut('fast');
						$('.nav-next').stop(1,1).fadeOut('fast');
					} else {
						$('#bb-nav-next').stop(1,1).fadeIn('fast');
						$('.nav-next').stop(1,1).fadeIn('fast');
					}

					if(has_audio) {
						if(!$(item).hasClass('audio-added')) {
							$(item).find('audio').mediaelementplayer();
							$(item).addClass('audio-added');
						}

						$('.audio').each(function() {
							var aid = $(this).attr("rel");
							setTimeout(function() {
								var audiop = document.getElementById(aid);
								audiop.pause();
							},500);
						});

						if($(item).hasClass('autoplay_audio')) {
							var naid = $(item).find('.audio').attr("rel");
							setTimeout(function() {
								var naudiop = document.getElementById(naid);
								naudiop.play();
							},500);
						}
						$(item).addClass('triggered');
						setTimeout(function() { $(item).removeClass('triggered'); },1500);
					}
					$('.current-slide').waitForImages(function() {
						toggle_zoom(1);
					});
				},
				circular: false
			} );
			initEvents();
		},
		initEvents = function() {

			var $slides = config.$bookBlock.children();

			// add navigation events
			config.$navNext.on( 'click touchstart', function() {
				config.$bookBlock.bookblock( 'next' );
				return false;
			} );

			config.$navPrev.on( 'click touchstart', function() {
				config.$bookBlock.bookblock( 'prev' );
				return false;
			} );
			// add swipe events
			$slides.on( {
				'swipeleft' : function( event ) {
					config.$bookBlock.bookblock( 'next' );
					return false;
				},
				'swiperight' : function( event ) {
					config.$bookBlock.bookblock( 'prev' );
					return false;
				}
			} );

			// add keyboard events
			$( document ).keydown( function(e) {
				var keyCode = e.keyCode || e.which,
					arrow = {
						left : 37,
						up : 38,
						right : 39,
						down : 40
					};

				switch (keyCode) {
					case arrow.left:
						config.$bookBlock.bookblock( 'prev' );
						break;
					case arrow.right:
						config.$bookBlock.bookblock( 'next' );
						break;
				}
			} );

			$("#page-count").val('1').keydown(function(e) {
				if(e.keyCode==13) {
					var page = parseInt($(this).val());
					if(!page) page = 1;
					$(this).val(page);
					config.$bookBlock.bookblock('jump',page);
				}
			}).blur(function() {
				var page = parseInt($(this).val());
				if(!page) page = 1;
				$(this).val(page);
				config.$bookBlock.bookblock('jump',page);
			});

			var current_orientation = ($(window).width()>800?'full':'mobile');
			var first_load = 1;

			var start_page = 0;
			if(window.location.hash) start_page = parseInt(window.location.hash.replace('#',''));
			if(start_page) config.$bookBlock.bookblock('jump',start_page);

			$(window).resize(function() {
				var new_orientation = ($(window).width()>800?'full':'mobile');
				if(new_orientation != current_orientation || (first_load && current_orientation=='mobile')) {
					current_orientation = new_orientation;
					first_load = 0;

					if(current_orientation == 'mobile') {
						zoom_width = 1000;
						$(".bb-custom-side").not(".first-page").each(function() {
							var page = $(this);
							$(this).closest('.bb-item').after('<div class="bb-item temp"></div>');
							$(this).closest('.bb-item').next('.bb-item.temp').append($(page));
						});

					} else {
						zoom_width = 2000;
						$(".bb-item.temp").each(function() {
							var tmp = $(this);
							var page = $(tmp).find('.bb-custom-side');
							$(tmp).prev('.bb-item').append($(page));
							$(tmp).remove();
						});
					}
					$('#total-pages').html($('.bb-item').length);
					config.$bookBlock.bookblock('update');

					config.$bookBlock.bookblock('jump',1);
				}

				var container_width = $("#bb-custom-wrapper-container").width();
				var container_height = $("#bb-custom-wrapper-container").height();

				var container_aspect_ratio = container_width/container_height;

				// page is too wide, so force by height


				if(container_aspect_ratio>(needed_aspect_ratio*(current_orientation=='full'&&has_half_width_spread?2:1))) {
					var new_width = container_height*needed_aspect_ratio*(current_orientation=='full'&&has_half_width_spread?2:1);
					var offset_left = new_width/2;

					$("#bb-custom-wrapper").css({
						'height':'100%',
						'width':new_width+'px',
						'margin-left':'-'+offset_left+'px',
						'margin-top':'0px',
						'top': 'auto',
						'left':'50%'
					});

				// page is too narrow, so force by width
				} else {
					var new_height = (container_width/needed_aspect_ratio)/(current_orientation=='full'&&has_half_width_spread?2:1);
					var offset_top = new_height/2;

					$("#bb-custom-wrapper").css({
						'width':'100%',
						'height':new_height+'px',
						'margin-top':'-'+offset_top+'px',
						'margin-left':'0px',
						'left': 'auto',
						'top':'50%'
					});
				}
			}).resize();
		};

		return { init : init };
})();

Page.init();


$("#bb-custom-wrapper-container").waitForImages(function() {
	$(this).fadeTo('slow',1,function() {
		$(".bb-custom-side").each(function() {
			var side = $(this);
			if($(side).hasClass('.is-full-width-spread')) {
				var url_readable = $(side).find("img.main-image").attr("src").replace("500/","1000/");
				var url_full = url_readable;
			} else {
				var url_readable = $(side).find("img.main-image").attr("src").replace("500/","1000/");
				var url_full = url_readable.replace("1000/","");
			}
			$(side).prepend('<div class="hq-image" style="background-image: url('+url_readable+');"></div>');
			$(side).prepend('<div class="hq-image big" style="background-image: url('+url_full+');"></div>');
			$(side).find("img.main-image").attr("src",url_full);
			$(side).attr('data-readable-image',url_readable);
			$(side).attr('data-full-image',url_full);
			$(side).find('img.main-image').on('load', function () {
				setTimeout(function() {
					$('.hq-image').fadeTo('fast',1);
				}, 500);
			}).each(function() {
				if(this.complete) $(this).load();
			});

			$(side).find('.hotspot-link').fadeIn("fast");

			// setup zooming
			//$('.bb-custom-side').zoom({ on:'click' });
		});
	});
	$("#spinner").fadeOut("slow");
});

// Find the right method, call on correct element
function launchIntoFullscreen(element) {
  element = document.body;

	$('body').addClass('fullscreen');

  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

if (document.addEventListener) {
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
}

function exitFullscreen() {
	$('body').removeClass('fullscreen');

  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function exitHandler() {
	if(!document.webkitIsFullScreen) {
		$('body').removeClass('fullscreen');

		$('#fullscreen-close').hide();
		$(window).resize();
	}

    if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== null) {

	} else {
		$('body').removeClass('fullscreen');

		$('#fullscreen-close').hide();
		$(window).resize();
	}
}

$('#bb-nav-fullscreen').click(function() {
	launchIntoFullscreen(document.getElementById("fullscreen-container"));
	$('#fullscreen-close').show();
	$(window).resize();
	return false;
});

$('#fullscreen-close').click(function() {
	exitFullscreen();
	$('#fullscreen-close').hide();
	$(window).resize();
	return false;
});

$(window).keydown(function(e) {
	if(e.keyCode==27 && is_full_screen_mode) {
		$('#fullscreen-close').click();
	}
});

$().ready(function() {
	$('.hotspot-link.overlay-link').on('click touchend',function() {
		var id = $(this).attr("href");
		var thehtml = $(id).html();

		showSoSimpleOverlay(thehtml);

		if(!$(id).find('.slideshow').length) $('.sosimple-overlay').addClass('no-gallery');

		$(window).resize(function() {

		}).resize();
	});
});

$('.hotspot-link').on('click touchend',function(e) {
	e.preventDefault();
	e.stopPropagation;
	if($(this).hasClass('overlay-link')) {

	} else {
		window.open($(this).attr("href"));
	}
	return false;
});

$('#menu-toggle').click(function() {
	if($(this).hasClass('selected')) {
		$(this).removeClass('selected').html('Menu');
		$('#mobile-wrap').stop(1,1).slideUp('fast',function() {
			$('.header').removeClass('engaged');
		});
	} else {
		$(this).addClass('selected').html('Close');
		$('.header').addClass('engaged');
		$('#mobile-wrap').stop(1,1).slideDown('fast',function() {
		});
	}
});

$(window).resize(function() {
	$('#menu-toggle').removeClass('selected').html('Menu');
	$('.header').removeClass('engaged');
	if($(window).width()>750) {
		$('#mobile-wrap').show();
	} else {
		$('#mobile-wrap').hide();
	}
}).resize();

$('.main-image').on('mousedown',function(e) {
	if(e.which == 3) return false;
});

$('.main-image').on('tap',function(e) {
	if($('#bb-bookblock').hasClass('zoomed')) {
		toggle_zoom(1);
	} else {
		toggle_zoom(0,e);
	}
});

function toggle_zoom(turn_off,e) {
	$(".bb-item").each(function() {
		if($(this).css('opacity')=='1') {
			$(this).addClass('current-slide');
		}
	});

	if(turn_off) {
		$('.bb-item.current-slide').find('.bb-custom-side').each(function() {
			$(this).find('.hq-image.big').css({'opacity':'0'});
		});
		$('.bb-item.current-slide').animate({
			'left': '0px',
			'top': '0px',
			'width': '100%',
			'height': '100%'
		},'fast',function() {
			$('#bb-bookblock').removeClass('zoomed');
		});
		$(document).unbind('mousemove');

	} else {
		$('.bb-item.current-slide').find('.bb-custom-side').each(function() {
			$(this).find('.hq-image.big').stop(1,1).fadeTo('fast','1');
		});

		$('#bb-bookblock').addClass('zoomed');

		var cur_height = $('.bb-item.current-slide').height();
		var cur_width = $('.bb-item.current-slide').width();
		zoom_width = cur_width*2.25;
		var cur_ratio = cur_height/cur_width;
		var new_height = cur_ratio * zoom_width;
		var zoom_ratio = zoom_width/cur_width;

		arr = calculate_offset(e,cur_width,cur_height,zoom_ratio);

		$('.bb-item.current-slide').stop(1,1).animate({
			'left': arr[0]+'px',
			'top': arr[1]+'px',
			'width':zoom_width+'px',
			'height':new_height+'px'
		},'fast',function() {
			$(document).mousemove(function(e) {
				do_move(e);
			});
		});
	}
}

$(document).on('drag',function(e) {
	if($('#bb-bookblock').hasClass('zoomed')) {
		do_move(e);
	}
});

function calculate_offset(e,start_width,start_height,zoom_ratio) {
	e.preventDefault();

	var container = $('#bb-bookblock.zoomed');
	if (typeof(e.x) !== 'undefined') {
		e.pageX = e.x;
		e.pageY = e.y;
	}

	var offset = $(container).offset();
	var left = (e.pageX - offset.left),
		top = (e.pageY - offset.top);

	if(left>start_width) left = start_width;
	if(left<0) left = 0;
	moveLeft = ((left/zoom_ratio)-left)*zoom_ratio;
	if(top>start_height) top = start_height;
	if(top<0) top = 0;
	moveTop = ((top/zoom_ratio)-top)*zoom_ratio;

	return arr = new Array(moveLeft,moveTop);
}

var x;

function do_move(e) {
	var container = $('#bb-bookblock.zoomed');
	var current_slide = $('.bb-item.current-slide');
	var container_width = $(container).width();
	var container_height = $(container).height();
	var current_slide_width = $(current_slide).width();
	var zoom_ratio = (current_slide_width/container_width);

	arr = calculate_offset(e,container_width,container_height,zoom_ratio);

	$('.bb-item.current-slide').css({
		'left': arr[0]+'px',
		'top': arr[1]+'px'
	});

	/*
    if (x) clearTimeout(x);
    x = setTimeout(function() {
		$('.bb-item.current-slide').stop(1,0).animate({
			'left': arr[0]+'px',
			'top': arr[1]+'px'
		},200);
    }, 5);
	*/
}


$().ready(function() {
	/* ----------------------------------------------------------------------------------------------------------------------- */
	/* Tooltips -------------------------------------------------------------------------------------------------------------- */
	/* ----------------------------------------------------------------------------------------------------------------------- */
	$('.showtip').tipsy({
		'gravity':'s'
	});


	/* ----------------------------------------------------------------------------------------------------------------------- */
	/* Embedding ------------------------------------------------------------------------------------------------------------- */
	/* ----------------------------------------------------------------------------------------------------------------------- */
	$("#bb-nav-embed").click(function() {
		$("#embed-overlay, #embed-underlay").fadeIn(350);
		$('#src').focus().select();
		return false;
	});

	$('#src').click(function() {
		$(this).select();
	});

	$('.close-embed-overlay-link').click(function() {
		$("#embed-overlay, #embed-underlay").fadeOut("slow");
		return false;
	});

	$('#embed-overlay-form input[type=checkbox], #embed-size').change(function() {
		update_src_iframe_embed();
	}).change();

	function update_src_iframe_embed() {
		var embed = '';
		var theurl = window.location.href;
		if(theurl.indexOf('#') > 0) {
			tmp = theurl.split('#');
			theurl = tmp[0];
		}
		theurl += (theurl.indexOf('?')!=-1?'&':'?')+'embed=1';

		$('#embed-overlay-form input[type=checkbox]').each(function() {
			if($(this).attr("checked")) {
				theurl += '&'+$(this).val()+'=1';
			}
		});

		var ewidth = '';
		var eheight = '';
		switch($('#embed-size').val()) {
			default:
			case 'small':
				ewidth = 640;
				eheight = 480;
				break;
			case 'medium':
				ewidth = 780;
				eheight = 585;
				break;
			case 'large':
				ewidth = 960;
				eheight = 720;
				break;
			case 'full':
				ewidth = '100%';
				eheight = '100%';
				break;
		}

		embed = '<iframe width="'+ewidth+'" height="'+eheight+'" src="'+theurl+'" frameborder="0" allowfullscreen></iframe>';
		$('#src').val(embed);
	}

	update_src_iframe_embed();

});