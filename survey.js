(function () {
  "use strict";

  var dialog = document.getElementById("training-survey");
  var form = document.getElementById("training-survey-form");
  var closeButtons = dialog.querySelectorAll(".survey-close, .survey-dismiss");
  var sessionKey = "training-survey-shown";

  function trackEvent(name) {
    if (window.fathom && typeof window.fathom.trackEvent === "function") {
      window.fathom.trackEvent(name);
    }
  }

  function dismissSurvey() {
    trackEvent("Survey - Dismissed");
    dialog.close();
  }

  closeButtons.forEach(function (button) {
    button.addEventListener("click", dismissSurvey);
  });

  dialog.addEventListener("cancel", function () {
    trackEvent("Survey - Dismissed");
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    trackEvent("Survey - Submitted");

    form.innerHTML =
      '<div class="survey-thanks" role="status">' +
      "<h2>Thank you!</h2>" +
      "<p>Thanks for completing the training survey.</p>" +
      '<button class="survey-submit" type="button">Return to the page</button>' +
      "</div>";

    form.querySelector("button").addEventListener("click", function () {
      dialog.close();
    });
  });

  function showSurveyAtScrollThreshold() {
    var scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollableHeight <= 0) {
      return;
    }

    var scrollPercent = (window.scrollY / scrollableHeight) * 100;

    if (scrollPercent >= 75) {
      sessionStorage.setItem(sessionKey, "true");
      window.removeEventListener("scroll", showSurveyAtScrollThreshold);
      dialog.showModal();
    }
  }

  if (!sessionStorage.getItem(sessionKey)) {
    window.addEventListener("scroll", showSurveyAtScrollThreshold, { passive: true });
    showSurveyAtScrollThreshold();
  }
})();
