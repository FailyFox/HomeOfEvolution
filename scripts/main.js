$(document).ready(function() {
    //handle hash change for the schedule page
    handleHash();
    $( window ).on( 'hashchange', function(e) {
        closeMenu();
        $('header.main').removeClass('open');
        handleHash();
    });
	$("#expandMenu>li>a").mouseenter(function(e) {
		$(e.target).closest('header.main').addClass('open');
	});
	$("#expandMenu").mouseleave(function(e) {
		$(e.target).closest('header.main').removeClass('open');
	});

	var intervalHeaderMoved = 0;

    $(window).on('scroll', function() {
        clearTimeout(intervalHeaderMoved);

        intervalHeaderMoved = setTimeout(function() {
            var $header = $('header.main');

            if(window.pageYOffset > 0) {
                $header.addClass('moved');
            } else {
                $header.removeClass('moved');
            }
        }, 15);
    });

    $('.owl-carousel').each(function() {
        var noItems = $(this).attr("items");
        $(this).owlCarousel({
            items: noItems,
            responsiveRefreshRate: 1,
            nav: false,
            mouseDrag: false,
            responsive: noItems > 1 ? {
                0: {
                    items: 1,
                    margin: 10,
                    stagePadding: 21
                },
                641: {
                    items: noItems > 1 ? 2 : noItems,
                    margin: 15,
                },
                769: {
                    items: noItems > 2 ? 3 : noItems,
                    loop: false
                }
            } : {},
            margin: (noItems > 1 ? 45 : 0),
            onInitialized: function() {
                //Fix on Safari to home top slider height
                var ua = navigator.userAgent.toLowerCase();
                if(ua.indexOf('safari') !=-1 && ua.indexOf('chrome') == -1) {
                    setTimeout(function() {
                        $(this).find('.owl-item > .slide-item').matchHeight().find('article').matchHeight();
                    }, 100);
                }
            }
        });
    });

    $("article[href]").click(function() {
        if ($(this).attr("href")) window.location.href=$(this).attr("href");
    });

    if ($('#scrollable-element.tabs').length>0) {
        $('.section-with-menu-container').first().siblings('.section-with-menu-container').hide();
    }

    if ($('#scrollable-element:not(.tabs)').length>0) {
        var sections = [];
        var lis = $('#scrollable-element:not(.tabs) > ul > li');
        lis.each(function() {
            sections.push($(this).attr('goto'));
        });
        $(window).scroll(function(e) {
            var section = 0;
            $.each(sections, function(i, value) {
                if (window.pageYOffset >= ($('#' + value).offset().top - 210)) {
                    section = i;
                }
            });
            if (!($(lis[section]).hasClass('active'))) {
                $(lis[section]).addClass('active').siblings().removeClass('active');
                //$('html.mobile #scrollable-element').scrollLeft($(lis[section]).position().left - 40);
            }
        });
    }

    $("article.adjust-height").each(function() {
        var photoHeight = $(this).find("figure").outerHeight(true);
        var contentHeight = $(this).find(".content").outerHeight(true) + 146;
        $(this).css("min-height", Math.max(photoHeight, contentHeight) + 140);
    });

    if (isMobile()) $("html").addClass("mobile"); else $("html").addClass("desktop");

    var intervalCloseSelect = 0;

    /* select in sangha groups */
    $('div.select').mouseenter(function() {
        clearTimeout(intervalCloseSelect);
    });
    $('div.select').mouseleave(function() {
        intervalCloseSelect = setTimeout(function() {
            $('[data-toggle-select]').removeClass('open current');
        }, 1000);
    });
    $('div.select').click(function(e) {
        $('section[data-toggle-select]').removeClass('current');
        $('section[data-toggle-select]').addClass('current').toggleClass('open');
        $('section[data-toggle-select].open:not(.current)').removeClass('open');
    });
    $('div.select select').change(function() {
        goToUrl($('div.select select').val());
    });

    var theme = $("html").attr("data-theme");
    if (theme!=undefined && theme!='') {
        if (theme=='bone') theme = "moon"; //exception for donate page
        if (theme=='ocean' || theme=='sun') theme = "fire"; //exception for mtv free page
        $("#expandMenu li." + theme).addClass("is-active");
        $(".mobile-menu-modules li." + theme).addClass("open");
    }

    $('.modal-overlay').click(function(e) {
        var modal = $(this);
        if (!modal.find('.modal-content')[0].contains(e.target)) {
            closeModals();
        }
    });
    $(document).keyup(function(e) {//escape
        if (e.keyCode === 27) closeModals();
    });

    if (!isMobile()) {
        $('section.donate-module .dWhy').hover(function() {
            $('section.donate-module .dWhy-info').show();
        }, function() {
            $('section.donate-module .dWhy-info').hide();
        });
    } else {
        $('section.donate-module .dWhy').click(function(e) {
            $('section.donate-module .dWhy-info').show();
            e.stopPropagation();
        });
        $('section.donate-module').click(function() {
            if ($('section.donate-module .dWhy-info').is(':visible')) {
                $('section.donate-module .dWhy-info').hide();
            }
        });
    }

    if ($('section.donate-module div.nif').length>0) {
        $.get('/wp-admin/admin-ajax.php?action=check_portugal').done(function( result ) {
            try {
                if (JSON.parse(result).country_code!='PT') {
                    $('section.donate-module div.nif').hide();
                }
            } catch (e) {
                console.log('Error for check_pt action.');
            }
        });
    }   
});

toggleMenu = function() {
	$('html').toggleClass('menu');
};

toggleDropmenu = function(e) {
	e.preventDefault();
	$(e.target).closest('li').toggleClass('open').siblings().removeClass('open').find('li').removeClass('open');
};

closeMenu = function() {
    $('html').removeClass('menu');
};

openToggle = function(e) {
    $(e.currentTarget).next().slideToggle().parent().toggleClass('open');
};

closeCookieAlert = function(e) {
    $(e.target).closest('.cookies-module').addClass('hide');

    Cookies.set("cookiesAlert", "1", { expires: 365 });
};

copy = function (txt) {
    var txt = document.location.href;
    if (!$("#_copy_").length) {
        $("body").append("<textarea id='_copy_' style='position: absolute; left: -9999px; top: 0' >" + txt + "</textarea>");
        $("#_copy_").get(0).select();
        document.execCommand("copy");
    }
}

scrl = function (e) {
    var sectionId = $(e.target).attr('goto');
    $([document.documentElement, document.body]).animate({
        scrollTop: $('#' + sectionId).offset().top - 200
    }, 500);
    $(e.target).closest('li').addClass('active').siblings().removeClass('active').find('li').removeClass('active');
    $('html.mobile #scrollable-element').animate({
        scrollLeft: $(e.target).position().left - 80
    }, 500);    
}

switchTab = function (e) {
    var sectionId = $(e.target).attr('goto');
    $('#' + sectionId).parent().fadeIn(500);
    $('.section-with-menu:not(#' + sectionId + ')').parent().hide();
    $([document.documentElement, document.body]).animate({
        scrollTop: $('#' + sectionId).offset().top - 200
    }, 500);
    $(e.target).closest('li').addClass('active').siblings().removeClass('active').find('li').removeClass('active');
    $('html.mobile #scrollable-element').animate({
        scrollLeft: $(e.target).position().left - 80
    }, 500);
}

goToUrl = function (url) {
    window.location.href = url;
}

toggleDescription = function (e) {
    $(e.target).closest("article").toggleClass("open");
}

subscribe = function(e, list, lang = 'EN') {
    e.preventDefault();
    var em = $(e.target).find('input[type=email]').val();
    $(e.target).find("button").attr("disabled", true);
    $.post('/wp-admin/admin-ajax.php?action=subscribe_newsletter',
        {
            email: em,
            list: list
        }).done(function() {   
            if (lang=='EN') {
                $('.mailing-lists-modal #mailing-list-name').html(list);
                $('.mailing-lists-modal input[type=checkbox]').prop('checked', false);
                $(".mailing-list[data-mailing-list-name='" + list + "']").hide();
                $('.mailing-lists-modal').show();
            } else {
                showModal('Thank you!', 'You have been added to our mailing list.');
            }
            $('.newsletter-container').hide();  
            gtag('event', 'Subscribe contextually', {'event_category': 'Newsletter', 'event_label': 'Subscribe on page '  + document.title, 'value': '0'});
        })
        .fail(showErrorModal)
        .always(function() {
            $(e.target).find("button").removeAttr("disabled");
        });
    return false;
}
closeModals = function() {
    $("div[modals-dctv]").empty();
    $('.modal-overlay').hide();
    if (qp('return_url')!=null) {
        window.location.href = qp('return_url');
    }
}

showErrorModal = function() {
    showModal('Oops, something went wrong...', 'Please try again later.');
}

showModal = function(title, text) {
    $("div[modals-dctv]").empty();
    $("div[modals-dctv]").prepend("<section class='modal-module show'>" +
    "<div class='section-container'>" +
        "<header><h3>" + title + "</h3>" +
        "<button onclick=\"closeModals()\">close</button></header>" +
    "<div class='content'" +
        "<p>" + text + "</p>" +
    "</div></div></section>"); 
}

submitMailingListChoices = function(e, em = undefined, listsRequired = false) {
    e.preventDefault();
    $(e.target).find("button").attr("disabled", true);
    if (em == undefined) {
        $('body input[type=email]').each(function(i, inp) {
            if (isValidEmail($(inp).val().trim())) em = $(inp).val().trim();
        });
    }
    if (em == undefined) {
        alert('Please enter a valid email address.');
        return false;
    }
    var lists = [];
    $('.mailing-list input[type=checkbox]:checked').each(function(i, chk) {
        lists.push($(chk).val());
    });
    if (lists.length==0) {
        if (listsRequired) {
            alert('Please select at least one mailing list to submit.');
        }
        return false;
    }
    $.post('/wp-admin/admin-ajax.php?action=subscribe_newsletter',
        {
            email: em,
            lists: lists
        }).done(function() {
            gtag('event', 'Subscribe contextually', {'event_category': 'Newsletter', 'event_label': 'Subscribe on page '  + document.title, 'value': '0'});
        })
        .fail(showErrorModal)
        .always(function() {
            $('.mailing-lists-modal').hide();
            $(e.target).find("button").removeAttr("disabled");
            if (qp('return_url')!=null) {
                window.location.href = qp('return_url');
            } else if ($(e.target).closest('.mailing-lists-page').length>0) {
                $('.mailing-lists-page').hide();
                $('.mailing-lists-thankyou').show();
            } else {
                showModal('Thank you!', 'Your preferences have been updated.');
            }
        });
    return false;
}

playTrack = function (e, songUrl) {
    var $this = $(e.currentTarget),
    $table = $this.closest('table');

    $table.find('tr.audio-player').remove();

    if(e.target.tagName === 'A') {
        return;
    }

    var player = ''+
            '<tr class="audio-player">' +
            '   <td colspan="5">' +
            '       <audio autoplay>' +
            '          <source src="'+ songUrl +'" type="audio/mpeg">' +
            '       </audio>' +
            '   </td>' +
            '</tr>' +
            '';

    if($this.hasClass('open')) {
        $this.removeClass('open');
    } else {
        $table.find('tr').removeClass('open');
        $this.after(player).dequeue().delay(0).queue(function() {
            $(this).addClass('open');
        });
    }
}
/* donate */
goToStep = function(step) {
    $(".step-1,.step-2").toggleClass("hidden");
    $('.agree input[type=checkbox]').prop("checked", false);
    $('.nif input[type=text]').val("");
    $('.birthdate select').val('0');
    if (step==2) {
        $(".step-2 .prev a").contents()[1].data = ($('select[name=give-currency]').val() == "eur" ? 'â‚¬' : 'Â£') + (getDonateAmount()/100);
        if (getDonateAmount()/100<100) {
            $('.fields').hide();
        } else {
            $('.fields').show();
        }
    }
}

getDonateAmount = function() {
    var value = parseInt($("input[type=radio][name=dValue]:checked").val());
    if (isNaN(value)) {
        value=Math.floor($(".step-1 input[name=otherValue]").val() * 100);
    }
    return value;
}

getDonateBirthdate = function() {
    if ($('.birthdate select[name=day]').val()=='0' || $('.birthdate select[name=month]').val()=='0' || $('.birthdate select[name=year]').val()=='0')
        return "";
    else return $('.birthdate select[name=year]').val() + '-' + $('.birthdate select[name=month]').val() + '-' + $('.birthdate select[name=day]').val();
}

getDonateAgree = function() {
    return $('.agree input[type=checkbox]').is(':checked') ? 'yes' : '';
}


$(document).ready(function() {
    $('input[type=radio][name=give-freq]').change(function() {
        $('.values label.monthlyVal').toggle(this.value == 'monthly');
        $('.values label.onceVal').toggle(this.value == 'once');

        $('input[type=radio][name=dValue]').prop('checked', false);
        if ($(".step-1 input[name=otherValue]").val()=='') {
            $('input[type=radio][name=dValue][value=' + (this.value=='monthly' ? '2500' : '5000') + ']').prop('checked', true);
        }

        $(".step-2>.prev>a").toggleClass("monthly", this.value == 'monthly')
    });
    $('select[name=give-currency]').change(function() {
        var sign = this.value == "eur" ? 'â‚¬' : 'Â£';
        $(".step-1 .values label strong").html(sign);
        $(".step-1 .otherValue").attr('data-currency', sign);
        if (this.value == "eur") {
            $("div.gift, div.methods p").addClass("hidden");
            $("#gift").prop("checked", false);
        } else {
            $("div.gift, div.methods p").removeClass("hidden");
        }
    });
    $(".step-1 input[name=otherValue]").focusin(function() {
        $('input[type=radio][name=dValue]').prop('checked', false);
    });
    $(".step-1 input[name=otherValue]").focusout(function() {
        if ($(this).val().trim()=="")
            if ($('input[type=radio][name=give-freq]:checked').val()=='once') {
                $('input[type=radio][name=dValue][value=2000]').prop('checked', true);
            } else {
                $('input[type=radio][name=dValue][value=1000]').prop('checked', true);
            }
    });   
});

validateDonateFields = function() {
    if (getDonateAmount()/100>=100) {
        if ($('.birthdate select[name=day]').val()=='0' || $('.birthdate select[name=month]').val()=='0' || $('.birthdate select[name=year]').val()=='0') {
            alert('Please fill in your birth date');
            return false;
        }
        if (!$('.agree input[type=checkbox]').is(':checked')) {
            alert('Please read and agree to our Privacy Policy');
            return false;
        }
    }
    return true;
}
stripeCheckout = function(stripeSessionUrl, stripeKey) {
    if (validateDonateFields()) {
        $.post(stripeSessionUrl, {
            freq: $('input[type=radio][name=give-freq]:checked').val(),
            currency: $('select[name=give-currency]').val().toUpperCase(),
            amount: getDonateAmount(),
            page_title: document.title,
            tcode: $("#tcode").val(),
            birthdate: getDonateBirthdate(),
            nif: $('input[name=nif]').val(),
            agree: getDonateAgree()
        }).done(function( stripeSessionId ) {
            var stripe = Stripe(stripeKey);
            stripe.redirectToCheckout({
                sessionId: stripeSessionId
            }).then(function (result) {
                alert(result.error.message);//better handling here
            });
        });
    } else return false;
}
paypalCheckout = function() {
    if (validateDonateFields()) {
        $('input[name=os3]').val(getDonateBirthdate());
        $('input[name=os4]').val(getDonateAgree());
        $('input[name=os5]').val($('input[name=nif]').val());
        $('#paypal-single-currency, #paypal-monthly-currency').val($('select[name=give-currency]').val().toUpperCase());
        $('#paypal-single-amount, #paypal-monthly-amount').val(getDonateAmount() / 100);
        if($('input[type=radio][name=give-freq]:checked').val() === 'once') {
            $('#paypal-single').submit();
        } else {
            $('#paypal-monthly').submit();
        }
    } else return false;
}

DonationEvent = function() {
    freq= $('input[type=radio][name=give-freq]:checked').val();
    currency= $('select[name=give-currency]').val().toUpperCase();
    amount= getDonateAmount();
    gtag('event', 'Click to Donate',{'event_category': 'Donate', 'event_label': 'Donate Click : ' + freq + ' - ' + currency + ' - ' + (amount/100) +'', 'value': '0'});
}

isMobile = function() {
    // device detection
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)));
}

handleHash = function() {
    if (location.hash.length>0) {
        var submenu = $("li[goto=" + location.hash.substring(1) + "]");
        if (submenu.length>0) {
            submenu.click();
        }
        else if (location.hash=='#monte-sahaja') $('li[goto=sahaja-section]').click();
        else if (location.hash=='#music') $('li[goto=music-section]').click();
        else if (location.href.indexOf('/faq')>=0) {
            var section = $(location.hash);
            if (section.length>0) {
                section.find('.content').slideToggle();
                section.addClass('open');
                $([document.documentElement, document.body]).animate({
                    scrollTop: section.offset().top - 120
                }, 200);
            }
        }
    }
}

isValidEmail = function(email) {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email));
}

qp = function (name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
