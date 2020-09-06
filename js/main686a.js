/* ----------------------------------------------------------------------------------------------------------------------- */
/* Initial Element Fade In on Scroll ------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------------------------- */
$('.middle-content > div, .footer-upper, .footer-middle, .footer, .homepage .box-2, .homepage .lower-boxes').addClass('fade-in');
$(window).scroll( function() {
	$('.fade-in').each(function(i) {
		var object_height = $(this).outerHeight();
		var bottom_of_object = $(this).position().top + object_height;
		var bottom_of_window = $(window).scrollTop() + $(window).height();

		/* Adjust the "200" to either have a delay or that the content starts fading a bit before you reach it  */
		bottom_of_window = bottom_of_window + object_height - 100;

		if(bottom_of_window > bottom_of_object) {
			$(this).animate({'opacity':'1'},1000);
		}
	});
}).scroll();


/* ---------------------------------------------------------------------------------------------------------------------- */
/* Left Navigation ------------------------------------------------------------------------------------------------------ */
/* ---------------------------------------------------------------------------------------------------------------------- */
var item = $(".left-nav li.selected");
if($(item).length) {
	targetParent = $(item).closest("ul");
	targetParentTagName = $(targetParent).get(0).tagName;

	while(targetParentTagName =='UL') {
		item = $(item).closest("ul");
		$(item).closest("li").addClass("selected");
		targetParent = $(item).parent();
		targetParentTagName = $(targetParent).get(0).tagName;
	}
}


// add .last class to all last lis
$("ul > li:first-child").addClass("first");
$("ul > li:last-child").addClass("last");


// replace hrs with wraps
$("hr").each(function() {
	if(!$(this).closest(".hr").length) {
		$(this).wrap('<div class="hr"></div>');
	}
});


/* ----------------------------------------------------------------------------------------------------------------------- */
/* Header Search --------------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------------------------- */
$('body').keyup(function(e) {
	if(e.keyCode==27) {
		$('body').removeClass('header-search-engaged');
		$('#header-search-text').blur();
	}
	if(!$(e.target).is('input') && !$(e.target).is('select') && !$(e.target).is('textarea')) {
		if(e.keyCode==83) {
			$('body').addClass('header-search-engaged');
			$('#header-search-text').focus();
		}
	}
});

$('#search-form-toggle').click(function() {
	if($('body').hasClass('header-search-engaged')) {
		$('body').removeClass('header-search-engaged');
		$('#header-search-text').blur();
	} else {
		$('body').addClass('header-search-engaged');
		$('#header-search-text').focus();
	}
	return false;
});

$('.header, .homepage, .footer, .middle-content').click(function() {
	$('body').removeClass('header-search-engaged');
	$('#header-search-text').blur();
});

$('#header-search-text').click(function() {
	return false;
});


/* ----------------------------------------------------------------------------------------------------------------------- */
/* News Content Box ------------------------------------------------------------------------------------------------------ */
/* ----------------------------------------------------------------------------------------------------------------------- */
if($('.side-box .content-box-list.news').length) {
	$('.side-box .content-box-list.news').closest('.side-box').find('h3').after('<a href="/news" class="button">Go to News</a>');
}


/* ----------------------------------------------------------------------------------------------------------------------- */
/* Wrap info-items txt --------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------------------------- */
if($('.row.info-item').length) {
	$('.row.info-item .col.text').each(function() {
		var html = $(this).html();
		$(this).html('<div class="text-wrap">'+html+'</div>');
	});

	$(window).resize(function() {
		$('.row.info-item .col.text .text-wrap').each(function() {
			var theheight = $(this).height()+30;
			if($(window).width() > 500) {
				$(this).closest('.row').find('.col').css({'height':theheight+'px', 'line-height':theheight+'px'});
			} else {
				$(this).closest('.row').find('.col').css({'height':'auto', 'line-height':'100%'});
			}
		});
	}).resize();
}


/* ----------------------------------------------------------------------------------------------------------------------- */
/* Inspiration Gallery / Select Box Replacement -------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------------------------- */
if($('#inspiration-gallery-filters').length) {
	$('#inspiration-gallery-filters').prepend('<div class="main-label">Featured Projects</div>');
	$('#inspiration-gallery-filters').wrapInner('<div class="wrapper"></div>');

	var delay = 0;
	$('.masonry-item').each(function() {
		$(this).delay(delay).fadeTo('slow',1);
		delay+=150;
	});

	$('#inspiration-gallery-masonry').wrap('<div class="wrapper"></div>');

	if($('.select-filter-wrap').length) {
		if(!window.location.hash || window.location.hash == '#') {
			$('.select-filter-wrap select').each(function() {
				var sel = $(this).find('option:eq(1)').val();
				$(this).val(sel);
			});
		}

		$('.masonry-item .caption').each(function() {
			var imgsrc = $(this).find('.image img').attr('src');
			$(this).closest('a').css({'background-image':'url('+imgsrc+')'});
			$(this).prepend($(this).find('.title'));
		});

		// check/set hash
		if(window.location.hash) {
			var hash_val_arr = window.location.hash.replace("#","").split("&");
			for(i=0;i<hash_val_arr.length;i++) {
				if(hash_val_arr[i]) {
					var hash_val_value_arr = hash_val_arr[i].split("sel[]=");
					var hash_val_value = hash_val_value_arr[1];

					$(".select-option-drop").each(function() {
						var select_opt = $(this);
						$(select_opt).find("option").each(function() {
							if($(this).attr("value")==hash_val_value) {
								$(select_opt).val(hash_val_value).change();
							}
						});
					});
				}
			}
		}

		$('.grid-filters-wrap #grid_category_id').selectBox();
		$('.select-filter-wrap select').selectBox();
	}

	$('#inspiration-gallery-filters').fadeTo('slow',1);
}


/* ----------------------------------------------------------------------------------------------------------------------- */
/* Headline Banner Replacement ------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------------------------- */
if($('.headline-banner').length) {
	$('.headline-banner').each(function() {
		var imgsrc = $(this).find('.image img').attr('src');
		$(this).find('.image').css({'background-image':'url('+imgsrc+')'});
	});

	$(window).scroll(function() {
		var scrolltop = $(window).scrollTop();
		var windowheight = $(window).height();
		var percentage = ((1 - (scrolltop/windowheight))*100)-50;

		$(".headline-banner .image").css({"background-position":"50% "+percentage+"%"});

	}).scroll();
}


// ---------------------------------------------------------------------------------------------------------------- */
// Toggle Links --------------------------------------------------------------------------------------------------- */
// ---------------------------------------------------------------------------------------------------------------- */
$(".toggle-more-link a").click(function() {
	if($(this).closest(".toggle-more-link").hasClass("selected")) {
		$(this).closest(".toggle-more-link").removeClass("selected").next(".toggle-more-content").slideUp("fast");

	} else {
		$(this).closest(".toggle-more-link").addClass("selected").next(".toggle-more-content").slideDown("fast");
	}
	return false;
});


// ---------------------------------------------------------------------------------------------------------------- */
// Disabled Buttons ----------------------------------------------------------------------------------------------- */
// ---------------------------------------------------------------------------------------------------------------- */
$(".disabled").click(function() {
	return false;
});




// ---------------------------------------------------------------------------------------------------------------- */
// Embedded/Photo Gallery Handling -------------------------------------------------------------------------------- */
// ---------------------------------------------------------------------------------------------------------------- */
$('.embedded-gallery').each(function() {
	$(this).find('.slide').each(function() {
		$(this).css({'background-image':'url('+$(this).find('img').attr('src')+')'});
	});
});



/* ----------------------------------------------------------------------------------------------------------------------- */
/* Custom Static Link for Social Share Page ------------------------------------------------------------------------------ */
/* ----------------------------------------------------------------------------------------------------------------------- */
if($('body').hasClass('page-type-30')) {
	// $('.filter-button-group').append('<a href="https://www.instagram.com/laneconstructioncorp/" target="_blank" class="showtip" title="Instagram" style="display: inline-block; vertical-align: middle;"><img src="/uploads/images/icons/instagram-icon.png" width="20" style="display: block;" /></a>');
	$('.filter-button-group').append('<div style="float: right; margin-top: 10px;"><a href="https://www.linkedin.com/company/the-lane-construction-corporation" target="_blank"><img src="/images/icons/view-on-linked-in.png" alt="View on LinkedIn" width="73" /></a></div>	');
}


/* ----------------------------------------------------------------------------------------------------------------------- */
/* Hardcode Spanish Translations ----------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------------------------- */
if($('body').hasClass('page-id-341185')) {
	$('.field-wrap').each(function() {
		if($(this).find('select').length) {
			$(this).find('select').find('option').first().text('--Seleccione--');
		}
	});

	$('.submit-wrap input[type=submit]').val('Enviar');

	var recaptcha_check_t;
	recaptcha_check_t = setInterval(function() {
		if($('#recaptcha_widget_1').find('iframe').length) {
			clearInterval(recaptcha_check_t);

			$('#recaptcha_widget_1').html('');

			$.when(add_js('//www.google.com/recaptcha/api.js?hl=es')).done(function() {
				setTimeout(function() {
					if($('#recaptcha_widget_1').length) {
						grecaptcha.render('recaptcha_widget_1', {
							'sitekey' : '6Lf6AyITAAAAAF-Co3ite5MrAMEu7f8jQnlihhf8',
							'callback' : function(response) {
							}
						});
					}
				},1000);
			});
		}
	},250);
}


/* ---------------------------------------------------------------------------------------------------------------------- */
/* Homepage Callout Links ----------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------- */
$('.callout-link').each(function() {
	var imgsrc = $(this).find('img').attr('src');
	$(this).css({'background-image':"url('"+imgsrc+"')"});
});


/* ---------------------------------------------------------------------------------------------------------------------- */
/* Primary Navigation Mobile Handling ----------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------- */
$(window).resize(function() {
	// iframes
	$("iframe").each(function() {
		if($(this).width() < $(this).attr("width")) {
			var ratio = $(this).attr("height")/$(this).attr("width");
			$(this).css({'height':($(this).width()*ratio)+'px'});
		}
	});


	if($(window).width() <= 670) {
		// header search
		$('#search-form-toggle').after($('#header-search'));

		$("#menu-toggle").unbind("click");

		$("#menu-toggle").click(function() {
			if($(this).hasClass("selected")) {
				$(this).removeClass("selected");
				$("#primary-navigation-wrap").stop(1,1).animate({'right':'-100%'},'fast');
				$(".body-wrap").stop(1,1).animate({'right':0},'fast', function() {
					$("body").css({'overflow-x':'visible'});
				});

			} else {
				$(this).addClass("selected");
				$("#primary-navigation-wrap").stop(1,1).animate({'right':'0'},'fast');
				$("body").css({'overflow-x':'hidden'});
				$(".body-wrap").stop(1,1).animate({'right':'80%'},'fast');
			}

			return false;
		});

		$("#primary-navigation-wrap li a").unbind("click");
		$("#primary-navigation-wrap li a").click(function() {
			var link = $(this);
			if($(link).next("ul").length) {
				if($(link).hasClass("selected")) {
					if($(this).attr('href') == 'https://careers.laneconstruct.com/' && $(this).closest('ul').hasClass('level-0')) return false;
					return true;

					//$(this).removeClass("selected");
					//$(this).next("ul").stop(1,1).slideUp("fast");
				} else {
					var delay = 0;
					if($(link).closest("ul").find("a.selected").length) {
						var delay = 250;
						$(link).closest("ul").find("ul").stop(1,1).slideUp(delay,function() {
							$(link).closest("ul").find("a").removeClass("selected");
							$(link).closest("ul").find("ul").hide();
						});
					} else {
						$(link).addClass("selected");
					}
					$(link).next("ul").stop(1,1).delay(delay).slideDown("fast");
				}
				return false;
			}
		});

	} else {
		// header search
		$('#header').after($('#header-search'));

		$("#primary-navigation-wrap").show();
		$("#primary-navigation-wrap li a").unbind("click");
		$('#primary-navigation-wrap li a[href="https://careers.laneconstruct.com/"]').click(function() {
			if($(this).closest('ul').hasClass('level-0')) return false;
		});
	}

});


$(window).resize();


if($('body').hasClass('page-id-635919')) {
	$(window).load(function() {
		$('#main-submission-form').get(0).reset();
		$('#main-submission-form')[0].reset();
		$('#main-submission-form').find(':input').not(':button,:submit,:reset,:hidden').trigger('change');
	});

	var form = $('#main-submission-form');

	// add last step validation (on form submit)
	$(form).submit(function() {
		var has_error = do_custom_validation();
		if(has_error) return false;
	});

	// current step validation
	function do_custom_validation() {
		var error = '';
		var validated_radios_and_checkboxes = new Array();

		$('.required').removeClass('error');

		$(form).find('.required').not('.conditionally-required').each(function() {
			var field_type = $(this).prop('nodeName').toLowerCase();
			if(field_type == 'input') {
				if($(this).attr('type') == 'checkbox') field_type = 'checkbox';
				if($(this).attr('type') == 'radio') field_type = 'radio';
			}

			switch(field_type) {
				case 'input':
				case 'select':
				case 'textarea':
				default:
					if(!$(this).val()) {
						$(this).addClass('error');
						var label = $(this).closest('.field-wrap').find('label').html().replace('<em>*</em>','');
						error += (error?'<br />':'')+'The Field "'+label+'" is required.';
					}
					break;

				case 'checkbox':
				case 'radio':
					var field_name = $(this).attr('name');

					var already_validated = 0;
					for(i=0;i<validated_radios_and_checkboxes.length;i++) {
						if(validated_radios_and_checkboxes[i] == field_name) already_validated = 1;
					}

					if(!already_validated) {
						if(!$('input[name="'+field_name+'"]:checked').length) {
							$(this).addClass('error');
							var label = $(this).closest('.field-wrap').find('label').first().html().replace('<em>*</em>','');
							error += (error?'<br />':'')+'The Field "'+label+'" is required.';
						}

						validated_radios_and_checkboxes.push(field_name);
					}
					break;
			}
		});

		// captcha validation
		if(cur_step == step_count && $(form).find('.recaptcha_widget').length) {
			var googleResponse = jQuery('#g-recaptcha-response').val();
			if (!googleResponse) error += (error?'<br />':'')+'Please check the "I\'m not a robot" box.';
		}

		// show error message if present
		if(error) showAlert(error,'bad');

		return error;
	}
}


/* ---------------------------------------------------------------------------------------------------------------------- */
/* Video Banner Detection ----------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------- */
if($('#video-outer-wrap').length) {
	if($('#video-outer-wrap').find('iframe').length && $('#video-outer-wrap').find('iframe').attr('src').indexOf('vimeo') >= 0) {
		$('#heading-wrap').addClass('has-video');
		$('#video-outer-wrap').find('iframe').attr('style','');
		var iframe = $('#video-outer-wrap').find('iframe')[0].outerHTML;
		$('#video-outer-wrap').html(iframe);
		var src = $('#video-outer-wrap').find('iframe').attr('src');
		$('#video-outer-wrap').find('iframe').attr('src',src+'&background=1&loop=1&autoplay=1');
	}
}