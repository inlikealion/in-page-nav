;
// Authored by Jonathan Bowman

/*------------------------------------*\
    PAGE NAVIGATOR:
\*------------------------------------*/


// LOAD OR CREATE THE RYOBI JS CLASSES
var ryobiTools = ryobiTools || {};
ryobiTools.components = ryobiTools.components || {};
ryobiTools.components.pageNavigator = ryobiTools.components.pageNavigator || {};

// HELPERS, TEMPLATES, AND DEFAULTS
ryobiTools.components.pageNavigator.navMenu = "<div class='page-navigator__nav-wrapper'><ul class='page-navigator__nav'></ul></div>";
ryobiTools.components.pageNavigator.navMenuItem = "<li class='page-navigator__nav__item' data-page-navigator-section='___SECTION_ID___'>___SECTION_TITLE___</li>";


(function($) {

  ryobiTools.components.pageNavigator.stickyHeader = function() {
    var scrollHeight = $(window).scrollTop();
    var navOffset = $(".page-navigator__nav-wrapper").offset().top;

    if (scrollHeight >= navOffset) {
      $(".page-navigator__nav").addClass("is-sticking");
    } else {
      $(".page-navigator__nav").removeClass("is-sticking");
      $(".page-navigator__nav__item.is-active").removeClass("is-active");
    }
  };

  ryobiTools.components.pageNavigator.setNavState = function() {
    var scrollHeight = $(window).scrollTop();
    var navOffset = $(".page-navigator__nav-wrapper").offset().top;

    if (scrollHeight >= navOffset) {
      var windowHeight = $(window).outerHeight(true);
      var docHeight = $(document).outerHeight(true);

      if ((scrollHeight + windowHeight) >= (docHeight - 50)) {
        $(".page-navigator__nav__item.is-active").not(".page-navigator__nav__item:last-child").removeClass("is-active");
        $(".page-navigator__nav__item:last-child").addClass("is-active");
        ryobiTools.components.pageNavigator.scrollSectionTitle($(".page-navigator__nav__item").index($(".page-navigator__nav__item.is-active")));
      } else {
        $(".js-page-navigator__section").each(function() {
          var sectionTop = $(this).offset().top;
          var sectionBottom = sectionTop + $(this).outerHeight(true);

          if ((scrollHeight + 100) >= sectionTop && (scrollHeight + 100) <= sectionBottom) {
            var sectionID = $(this).attr("data-page-navigator-section");
            $(".page-navigator__nav__item.is-active").not(".page-navigator__nav__item[data-page-navigator-section='" + sectionID + "']").removeClass("is-active");
            $(".page-navigator__nav__item[data-page-navigator-section='" + sectionID + "']").addClass("is-active");
            ryobiTools.components.pageNavigator.scrollSectionTitle($(".page-navigator__nav__item").index($(".page-navigator__nav__item.is-active")));
          }
        });
      }
    }
  };

  ryobiTools.components.pageNavigator.scrollSectionTitle = function(sectionPosition) {
    var position = sectionPosition * -50;
    $(".page-navigator__nav__item").velocity("stop").velocity({
      top: position + "px"
    }, {
      duration: 400,
      easing: "easeOutExpo"
    });

    ryobiTools.components.pageNavigator.collapseMobileMenu();
  };

  ryobiTools.components.pageNavigator.expandMobileMenu = function() {
    if (Modernizr.mq('(max-width: 767px)')) {
      var height = $(".page-navigator__nav").children().length * 50;
      $(".page-navigator__nav").addClass("is-open");

      $(".page-navigator__nav").velocity("stop").velocity({
        height: height + "px"
      }, {
        duration: 400,
        easing: "easeOutExpo"
      });

      $(".page-navigator__nav__item").velocity("stop").velocity({
        "top" : "0"
      }, {
        duration: 400,
        easing: "easeOutExpo"
      });
    }
  };

  ryobiTools.components.pageNavigator.collapseMobileMenu = function() {
    if (Modernizr.mq('(max-width: 767px)')) {
      $(".page-navigator__nav").removeClass("is-open");

      $(".page-navigator__nav").velocity("stop").velocity({
        height: "50px"
      }, {
        duration: 400,
        easing: "easeOutExpo"
      });
    }
  };

  ryobiTools.components.pageNavigator.scrollToSection = function(sectionID) {
    var section = $(".js-page-navigator__section[data-page-navigator-section='" + sectionID + "']");
    section.velocity("stop").velocity("scroll");
  };


})(jQuery);

$(document).ready(function() {

  /*-------------------*\
  		INITIALIZERS:
  \*-------------------*/

  $(window).load(function() {
    ryobiTools.components.pageNavigator.stickyHeader();
    ryobiTools.components.pageNavigator.setNavState();
  });


  /*-------------------*\
  		BOUND EVENTS:
  \*-------------------*/

  var scrollTimer;
  var scrollInterval;
  var intervalRunning = false;
  $(window).scroll(function() {
    ryobiTools.components.pageNavigator.stickyHeader();

    if ($(".page-navigator__nav").hasClass("is-sticking")) {
      clearTimeout(scrollTimer);

      if (!intervalRunning) {
        scrollInterval = setInterval(function() {
          ryobiTools.components.pageNavigator.setNavState();
        }, 100);
        intervalRunning = true;
      }

      scrollTimer = setTimeout(function() {
        clearInterval(scrollInterval);
        ryobiTools.components.pageNavigator.setNavState();
        intervalRunning = false;
      }, 100);
    }
  });

  $("body").on("click", ".page-navigator__nav__item", function(event) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    if ($(".page-navigator__nav").hasClass("is-open") || Modernizr.mq('(min-width: 768px)')) {
      var sectionID = $(this).attr("data-page-navigator-section");
      ryobiTools.components.pageNavigator.scrollToSection(sectionID);
    }
  });

  $("body").on("click", ".page-navigator__nav", function(event) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    if ($(this).hasClass("is-open")) {
      ryobiTools.components.pageNavigator.collapseMobileMenu();
    } else {
      ryobiTools.components.pageNavigator.expandMobileMenu();
    }
  });

  $("body").click(function(event) {
    if ($(".page-navigator__nav").hasClass("is-open") && $(event.target).closest(".page-navigator__nav").length <= 0) {
      ryobiTools.components.pageNavigator.setNavState();
    }
  });

});
