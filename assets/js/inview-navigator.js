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

      ryobiTools.components.inViewNavigator.setStickyState(navID);
      ryobiTools.components.inViewNavigator.setNavState(navID);

      navID ++;
    });
  };

  ryobiTools.components.inViewNavigator.setStickyState = function(navID) {
    var navSection = $(".inview-navigator[data-inview-navigator-id='" + navID + "']");
    var navWrapper = navSection.find(".inview-navigator__nav-wrapper");
    var navBar = navWrapper.find(".inview-navigator__nav");
    var navActiveItem = navWrapper.find(".inview-navigator__nav__item.is-active");
    var navOffset = navWrapper.offset().top;
    var scrollHeight = $(window).scrollTop();

    if ((scrollHeight + 50) >= (navOffset + navSection.outerHeight())) {
      navBar.addClass("at-end");
    } else if (scrollHeight >= navOffset) {
      navBar.removeClass("at-end");
      navBar.addClass("is-sticking");
    } else {
      navBar.removeClass("is-sticking");
      navActiveItem.removeClass("is-active");
    }
  };

  ryobiTools.components.inViewNavigator.setNavState = function(navID) {
    var scrollHeight = $(window).scrollTop();
    var navOffset = $(".inview-navigator__nav-wrapper").offset().top;

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
    if (Modernizr.mq('(max-width: 767px)')) {
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
    if (Modernizr.mq('(max-width: 767px)')) {
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
    var section = $(".js-inview-navigator__section[data-inview-navigator-section='" + sectionID + "']");
    section.velocity("stop").velocity("scroll");
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

  $(window).scroll(function() {
    $(".inview-navigator__nav").each(function() {
      var navID = $(this).attr("data-inview-navigator-id");

      if (navID) {
        var scrollTimer;
        var scrollInterval;
        var intervalRunning = false;

        ryobiTools.components.inViewNavigator.setStickyState(navID);

        if ($(this).hasClass("is-sticking")) {
          clearTimeout(scrollTimer);

          if (!intervalRunning) {
            scrollInterval = setInterval(function() {
              ryobiTools.components.inViewNavigator.setNavState(navID);
            }, 100);
            intervalRunning = true;
          }

          scrollTimer = setTimeout(function() {
            clearInterval(scrollInterval);
            ryobiTools.components.inViewNavigator.setNavState(navID);
            intervalRunning = false;
          }, 100);
        }
      }
    });
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
