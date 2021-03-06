var body = $('body');

window.lazySizesConfig = window.lazySizesConfig || {};
window.lazySizesConfig.loadHidden = false;

$(function () {
    'use strict';
    nsfwGate();
    author();
    stickySidebar();
    pagination();
    video();
    gallery();
    offCanvas();
});

function nsfwGate() {
    'use strict';

    if ($(".tag-nsfw").length <= 0) {
        return; // There are no nsfw elements on this page
    }

    var nsfwOk = false;
    document.cookie.split(";").find(function (c) {
        if (c.trim() === "nsfwOk=true") {
            nsfwOk = true;
        }
    });

    if (nsfwOk) {
        return;
    } else {
        $("#nsfw-gate").show();
    }

    var consent = $("#nsfw-consent");
    var legal = $("#nsfw-legal");
    var submit = $("#nsfw-submit");

    function validate() {
        if (!consent.prop("checked") || !legal.prop("checked")) {
            submit.attr("disabled", "");
        } else {
            submit.removeAttr("disabled");
        }
    }

    validate();
    consent.change(validate);
    legal.change(validate);

    submit.click(function () {
        console.log("hit submit");
        var date = new Date();
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
        document.cookie = "nsfwOk=true; Path=/; SameSite=strict; Expires=" + date.toUTCString();
        $("#nsfw-gate").hide();
    });
}

function author() {
    'use strict';
    $('.author-name').on('click', function () {
        $(this).next('.author-social').toggleClass('enabled');
    });
}

function stickySidebar() {
    'use strict';
    var marginTop = 30;

    jQuery('.sidebar-column, .related-column').theiaStickySidebar({
        additionalMarginTop: marginTop,
        additionalMarginBottom: 30,
    });
}

function pagination() {
    'use strict';
    var wrapper = $('.post-feed .row');
    var button = $('.infinite-scroll-button');

    if (body.hasClass('paged-next')) {
        wrapper.on('request.infiniteScroll', function (event, path) {
            button.hide();
        });

        wrapper.on('load.infiniteScroll', function (event, response, path) {
            if ($(response).find('body').hasClass('paged-next')) {
                button.show();
            }
        });

        wrapper.infiniteScroll({
            append: '.post-column',
            button: '.infinite-scroll-button',
            debug: false,
            hideNav: '.pagination',
            history: false,
            path: '.pagination .older-posts',
            scrollThreshold: false,
            status: '.infinite-scroll-status',
        });
    }
}

function video() {
    'use strict';
    $('.post-content').fitVids();
}

function gallery() {
    'use strict';
    var images = document.querySelectorAll('.kg-gallery-image img');
    images.forEach(function (image) {
        var container = image.closest('.kg-gallery-image');
        var width = image.attributes.width.value;
        var height = image.attributes.height.value;
        var ratio = width / height;
        container.style.flex = ratio + ' 1 0%';
    });

    pswp(
        '.kg-gallery-container',
        '.kg-gallery-image',
        '.kg-gallery-image',
        false,
        true
    );
    pswp('.kg-image-card', '.kg-image', '.kg-image', false, false);
    pswp('.post-main-image-container', '.post-main-image', '.post-main-image', false, false);
}

function offCanvas() {
    'use strict';
    $('.burger:not(.burger.close)').on('click', function () {
        body.addClass('canvas-visible canvas-opened');
        dimmer('open', 'medium');
    });

    $('.burger-close').on('click', function () {
        if (body.hasClass('canvas-opened')) {
            body.removeClass('canvas-opened');
            dimmer('close', 'medium');
        }
    });

    $('.dimmer').on('click', function () {
        if (body.hasClass('canvas-opened')) {
            body.removeClass('canvas-opened');
            dimmer('close', 'medium');
        }
    });
}

function pswp(container, element, trigger, caption, isGallery) {
    var parseThumbnailElements = function (el) {
        var items = [],
            gridEl,
            linkEl,
            item;

        $(el)
            .find(element)
            .each(function (i, v) {
                gridEl = $(v);
                linkEl = gridEl.find(trigger);

                item = {
                    src: isGallery
                        ? gridEl.find('img').attr('src')
                        : gridEl.attr('src'),
                    w: 0,
                    h: 0,
                };

                if (caption && gridEl.find(caption).length) {
                    item.title = gridEl.find(caption).html();
                }

                items.push(item);
            });

        return items;
    };

    var openPhotoSwipe = function (index, galleryElement) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        options = {
            closeOnScroll: false,
            history: false,
            index: index,
            shareEl: false,
            showAnimationDuration: 0,
            showHideOpacity: true,
        };

        gallery = new PhotoSwipe(
            pswpElement,
            PhotoSwipeUI_Default,
            items,
            options
        );
        gallery.listen('gettingData', function (index, item) {
            if (item.w < 1 || item.h < 1) {
                // unknown size
                var img = new Image();
                img.onload = function () {
                    // will get size after load
                    item.w = this.width; // set image width
                    item.h = this.height; // set image height
                    gallery.updateSize(true); // reinit Items
                };
                img.src = item.src; // let's download image
            }
        });
        gallery.init();
    };

    var onThumbnailsClick = function (e) {
        e.preventDefault();

        var index = $(e.target)
            .closest(container)
            .find(element)
            .index($(e.target).closest(element));
        var clickedGallery = $(e.target).closest(container);

        openPhotoSwipe(index, clickedGallery[0]);

        return false;
    };

    $(container).on('click', trigger, function (e) {
        onThumbnailsClick(e);
    });
}

function dimmer(action, speed) {
    'use strict';
    var dimmer = $('.dimmer');

    switch (action) {
        case 'open':
            dimmer.fadeIn(speed);
            break;
        case 'close':
            dimmer.fadeOut(speed);
            break;
    }
}
