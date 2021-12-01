//plugin for counting up to a target number
(function($) {
    $.fn.countTo = function(options) {
        // merge the default plugin settings with the custom options
        options = $.extend({}, $.fn.countTo.defaults, options || {});

        // how many times to update the value, and how much to increment the value on each update
        var loops = Math.ceil(options.speed / options.refreshInterval),
            increment = (options.to - options.from) / loops;

        return $(this).each(function() {
            var _this = this,
                loopCount = 0,
                value = options.from,
                interval = setInterval(updateTimer, options.refreshInterval);

            function updateTimer() {
                value += increment;
                loopCount++;
                $(_this).html(value.toFixed(options.decimals));

                if (typeof(options.onUpdate) == 'function') {
                    options.onUpdate.call(_this, value);
                }

                if (loopCount >= loops) {
                    clearInterval(interval);
                    value = options.to;

                    if (typeof(options.onComplete) == 'function') {
                        options.onComplete.call(_this, value);
                    }
                }
            }
        });
    };

    $.fn.countTo.defaults = {
        from: 0, // the number the element should start at
        to: 100, // the number the element should end at
        speed: 1000, // how long it should take to count between the target numbers
        refreshInterval: 100, // how often the element should be updated
        decimals: 0, // the number of decimal places to show
        onUpdate: null, // callback method for every time the element is updated,
        onComplete: null, // callback method for when the element finishes updating
    };
})(jQuery);

$(() => {
    // for sliding in featurette elements
    $(window).scroll(function() {
        $(".slide-anim").each(function() {
            var pos = $(this).offset().top;

            var winTop = $(window).scrollTop();
            if (pos < winTop + 600) {
                $(this).addClass("slide");
            }
            if (pos > winTop + 600) {
                $(this).removeClass("slide");
            }
        });
    });
    //onscroll the number increment plugin is invoked
    // tag is used to prevent the plugin being called more than once
    var tag1 = 0;
    $(window).scroll(function(evt) {
        $("#num-increment-anim1").each(function(evt) {
            var pos = $(this).offset().top;
            var winTop = $(window).scrollTop();
            if (pos < winTop + 600 && tag1 == 0) {
                tag1 = 1;
                $(this).countTo({
                    from: 0,
                    to: $(this).attr('data-count'),
                    speed: 2000,
                    refreshInterval: 50,
                    decimals: 2,
                    onComplete: function(value) {
                        console.debug(this);
                    }
                });
            }
            // for resetting the plugin once the scroll position is far above
            if (pos > winTop + 600) {
                tag1 = 0;
            }
        });
    });
    var tag2 = 0;
    $(window).scroll(function(evt) {
        $("#num-increment-anim2").each(function(evt) {
            var pos = $(this).offset().top;
            var winTop = $(window).scrollTop();
            if (pos < winTop + 600 && tag2 == 0) {
                tag2 = 1;
                $(this).countTo({
                    from: 0,
                    to: $(this).attr('data-count'),
                    speed: 2000,
                    refreshInterval: 50,
                    decimals: 2,
                    onComplete: function(value) {
                        console.debug(this);
                    }
                });
            }
            if (pos > winTop + 600) {
                tag2 = 0;
            }
        });
    });

    var tag3 = 0;
    $(window).scroll(function(evt) {
        $("#num-increment-anim3").each(function(evt) {
            var pos = $(this).offset().top;
            var winTop = $(window).scrollTop();
            if (pos < winTop + 600 && tag3 == 0) {
                tag3 = 1;
                $(this).countTo({
                    from: 0,
                    to: $(this).attr('data-count'),
                    speed: 2000,
                    refreshInterval: 50,
                    decimals: 2,
                    onComplete: function(value) {
                        console.debug(this);
                    }
                });
            }
            if (pos > winTop + 600) {
                tag3 = 0;
            }
        });
    });

});
