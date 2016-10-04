;
// Authored by Jonathan Bowman

/*------------------------------------*\
    PAGE NAVIGATOR:
\*------------------------------------*/


// LOAD OR CREATE THE RYOBI JS CLASSES
var ryobiTools = ryobiTools || {};
ryobiTools.components = ryobiTools.components || {};
ryobiTools.components.inViewNavigator = ryobiTools.components.inViewNavigator || {};


(function($) {

  ryobiTools.components.inViewNavigator.init = function() {
    var navID = 0;
    $(".inview-navigator").each(function() {
      $(this).attr("data-inview-navigator-id", navID);
      $(this).find(".inview-navigator__nav-wrapper").attr("data-inview-navigator-id", navID);
      $(this).find(".inview-navigator__nav").attr("data-inview-navigator-id", navID);

      ryobiTools.components.inViewNavigator.setStickyState();
      ryobiTools.components.inViewNavigator.setNavState();

      navID ++;
    });
  };

  ryobiTools.components.inViewNavigator.setStickyState = function() {
    var inViewNavigator = $(".inview-navigator");
    var navWrapper = inViewNavigator.find(".inview-navigator__nav-wrapper");
    var navBar = navWrapper.find(".inview-navigator__nav");
    var navActiveItem = navWrapper.find(".inview-navigator__nav__item.is-active");
    var navOffset = navWrapper.offset().top;
    var scrollHeight = $(window).scrollTop();
    var optionalOffset = parseInt(inViewNavigator.attr("data-inview-navigator-offset"));

    if (optionalOffset && !Modernizr.mq('(max-width: 768px)')) {
      navOffset = navOffset - optionalOffset;
    }

    if ((scrollHeight + 50) >= (navOffset + inViewNavigator.outerHeight())) {
      inViewNavigator.addClass("at-end");
      navBar.css("top", "auto");
    } else if (scrollHeight >= navOffset) {
      inViewNavigator.removeClass("at-end");
      inViewNavigator.addClass("is-sticking");
      if (optionalOffset && !Modernizr.mq('(max-width: 768px)')) {
        navBar.css("top", optionalOffset + "px");
      } else {
        navBar.css("top", "0");
      }
    } else {
      inViewNavigator.removeClass("is-sticking");
      navActiveItem.removeClass("is-active");
      navBar.css("top", "auto");
    }
  };

  ryobiTools.components.inViewNavigator.setNavState = function() {
    var inViewNavigator = $(".inview-navigator");
    var scrollHeight = $(window).scrollTop();
    var navOffset = $(".inview-navigator__nav-wrapper").offset().top;
    var optionalOffset = parseInt(inViewNavigator.attr("data-inview-navigator-offset"));

    if (optionalOffset && !Modernizr.mq('(max-width: 768px)')) {
      navOffset = navOffset - optionalOffset;
    }

    if (scrollHeight >= navOffset) {
      var windowHeight = $(window).outerHeight(true);
      var docHeight = $(document).outerHeight(true);

      if ((scrollHeight + windowHeight) >= (docHeight - 50)) {
        $(".inview-navigator__nav__item.is-active").not(".inview-navigator__nav__item:last-child").removeClass("is-active");
        $(".inview-navigator__nav__item:last-child").addClass("is-active");
        ryobiTools.components.inViewNavigator.scrollSectionTitle($(".inview-navigator__nav__item").index($(".inview-navigator__nav__item.is-active")));
      } else {
        $(".js-inview-navigator__section").each(function() {
          var sectionTop = $(this).offset().top;
          var sectionBottom = sectionTop + $(this).outerHeight(true);

          if (optionalOffset && !Modernizr.mq('(max-width: 768px)')) {
            sectionTop = sectionTop - optionalOffset;
          }

          if ((scrollHeight + 100) >= sectionTop && (scrollHeight + 100) <= sectionBottom) {
            var sectionID = $(this).attr("data-inview-navigator-section");
            $(".inview-navigator__nav__item.is-active").not(".inview-navigator__nav__item[data-inview-navigator-section='" + sectionID + "']").removeClass("is-active");
            $(".inview-navigator__nav__item[data-inview-navigator-section='" + sectionID + "']").addClass("is-active");
            ryobiTools.components.inViewNavigator.scrollSectionTitle($(".inview-navigator__nav__item").index($(".inview-navigator__nav__item.is-active")));
          }
        });
      }
    }
  };

  ryobiTools.components.inViewNavigator.scrollSectionTitle = function(sectionPosition) {
    var position = sectionPosition * -50;
    $(".inview-navigator__nav__item").velocity("stop").velocity({
      top: position + "px"
    }, {
      duration: 400,
      easing: "easeOutExpo"
    });

    ryobiTools.components.inViewNavigator.collapseMobileMenu();
  };

  ryobiTools.components.inViewNavigator.expandMobileMenu = function() {
    if (Modernizr.mq('(max-width: 768px)')) {
      var height = $(".inview-navigator__nav").children().length * 50;
      $(".inview-navigator__nav").addClass("is-open");

      $(".inview-navigator__nav").velocity("stop").velocity({
        height: height + "px"
      }, {
        duration: 400,
        easing: "easeOutExpo"
      });

      $(".inview-navigator__nav__item").velocity("stop").velocity({
        "top" : "0"
      }, {
        duration: 400,
        easing: "easeOutExpo"
      });
    }
  };

  ryobiTools.components.inViewNavigator.collapseMobileMenu = function() {
    if (Modernizr.mq('(max-width: 768px)')) {
      $(".inview-navigator__nav").removeClass("is-open");

      $(".inview-navigator__nav").velocity("stop").velocity({
        height: "50px"
      }, {
        duration: 400,
        easing: "easeOutExpo"
      });
    }
  };

  ryobiTools.components.inViewNavigator.scrollToSection = function(sectionID) {
    var inViewNavigator = $(".inview-navigator");
    var optionalOffset = parseInt(inViewNavigator.attr("data-inview-navigator-offset"));
    var section = $(".js-inview-navigator__section[data-inview-navigator-section='" + sectionID + "']");

    if (Modernizr.mq('(max-width: 768px)')) {
      section.velocity("stop").velocity("scroll");
    } else {
      section.velocity("stop").velocity("scroll", {
        offset: -optionalOffset - 50
      });
    }
  };


})(jQuery);

$(document).ready(function() {

  /*-------------------*\
  		INITIALIZERS:
  \*-------------------*/

  $(window).load(function() {
    ryobiTools.components.inViewNavigator.init();
  });


  /*-------------------*\
  		BOUND EVENTS:
  \*-------------------*/

  var scrollTimer;
  var scrollInterval;
  var intervalRunning = false;
  $(window).scroll(function() {
    ryobiTools.components.inViewNavigator.setStickyState();

    if ($(".inview-navigator").hasClass("is-sticking")) {
      clearTimeout(scrollTimer);

      if (!intervalRunning) {
        scrollInterval = setInterval(function() {
          ryobiTools.components.inViewNavigator.setNavState();
        }, 100);
        intervalRunning = true;
      }

      scrollTimer = setTimeout(function() {
        clearInterval(scrollInterval);
        ryobiTools.components.inViewNavigator.setNavState();
        intervalRunning = false;
      }, 100);
    }
  });

  $(window).resize(function() {
    ryobiTools.components.inViewNavigator.setStickyState();
  });

  $("body").on("click", ".inview-navigator__nav__item", function(event) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    if ($(".inview-navigator__nav").hasClass("is-open") || Modernizr.mq('(min-width: 768px)')) {
      var sectionID = $(this).attr("data-inview-navigator-section");
      ryobiTools.components.inViewNavigator.scrollToSection(sectionID);
    }
  });

  $("body").on("click", ".inview-navigator__nav", function(event) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    if ($(this).hasClass("is-open")) {
      ryobiTools.components.inViewNavigator.collapseMobileMenu();
    } else {
      ryobiTools.components.inViewNavigator.expandMobileMenu();
    }
  });

  $("body").click(function(event) {
    if ($(".inview-navigator__nav").hasClass("is-open") && $(event.target).closest(".inview-navigator__nav").length <= 0) {
      ryobiTools.components.inViewNavigator.setNavState();
    }
  });

});
