//add class active to nav elements
$(()=>{
    $("#nav-menu-btn").click(()=>{
        var n = $("#navbar");
        if(n.hasClass('collapse')){
            n.removeClass('collapse');
        }
        else
            n.addClass('collapse');
    });

    var listItem = $("#navbar > ul:first-child > li > a");
    var url = window.location.href;
    var activePage = url;
    listItem.each(function () {
        var linkPage = this.href;

        if (activePage == linkPage) {
            $(this).closest("li").addClass("active");
        }
    });

    var darkButton = $("#dark-mode-btn");
    darkButton.click(()=>{
        var n = $('nav')
        if(n.hasClass('navbar-inverse')){
            n.removeClass('navbar-inverse');
        }
        else
            n.addClass('navbar-inverse');

        if(darkButton.children('a').children('p').text() == 'Light Mode'){
            darkButton.children('a').children('p').text('Dark Mode');
        }
        else
            darkButton.children('a').children('p').text('Light Mode');

        var f = $('body > footer');
        if(f.hasClass('light-footer')){
            f.removeClass('light-footer');
            f.addClass('dark-footer');
        }
        else {
            f.removeClass('dark-footer');
            f.addClass('light-footer');
        }

        $('.logo').toggle();
    });
});
