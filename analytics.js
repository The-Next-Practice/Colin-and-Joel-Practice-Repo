(function () {
  "use strict";

  function trackEvent(name) {
    if (window.fathom && typeof window.fathom.trackEvent === "function") {
      window.fathom.trackEvent(name);
    }
  }

  document.addEventListener("click", function (event) {
    var target = event.target.closest("[data-fathom-event]");

    if (target) {
      trackEvent(target.dataset.fathomEvent);
    }
  });

  if ("IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            trackEvent(entry.target.dataset.fathomView);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("[data-fathom-view]").forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  var scrollMilestones = [
    { percent: 50, event: "Scroll - 50 Percent", tracked: false },
    { percent: 90, event: "Scroll - 90 Percent", tracked: false }
  ];

  function trackScrollMilestones() {
    var scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollableHeight <= 0) {
      return;
    }

    var scrollPercent = (window.scrollY / scrollableHeight) * 100;

    scrollMilestones.forEach(function (milestone) {
      if (!milestone.tracked && scrollPercent >= milestone.percent) {
        milestone.tracked = true;
        trackEvent(milestone.event);
      }
    });

    if (scrollMilestones.every(function (milestone) { return milestone.tracked; })) {
      window.removeEventListener("scroll", trackScrollMilestones);
    }
  }

  window.addEventListener("scroll", trackScrollMilestones, { passive: true });
})();
