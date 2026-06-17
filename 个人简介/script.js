(function () {
  var storageKey = "rain-profile-theme";
  var root = document.documentElement;
  var themeToggle = document.querySelector(".theme-toggle");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  function getSavedTheme() {
    try {
      return localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      return;
    }
  }

  function getSystemTheme() {
    return systemDark.matches ? "dark" : "light";
  }

  function setTheme(theme, shouldSave) {
    root.setAttribute("data-theme", theme);

    if (themeToggle) {
      var label = theme === "dark" ? "切换浅色模式" : "切换深色模式";
      themeToggle.setAttribute("aria-label", label);
      themeToggle.setAttribute("title", label);
    }

    if (shouldSave) {
      saveTheme(theme);
    }
  }

  function initTheme() {
    var savedTheme = getSavedTheme();
    setTheme(savedTheme || getSystemTheme(), Boolean(savedTheme));
  }

  function bindThemeToggle() {
    if (!themeToggle) {
      return;
    }

    themeToggle.addEventListener("click", function () {
      var currentTheme = root.getAttribute("data-theme") || getSystemTheme();
      setTheme(currentTheme === "dark" ? "light" : "dark", true);
    });

    var syncSystemTheme = function () {
      if (!getSavedTheme()) {
        setTheme(getSystemTheme(), false);
      }
    };

    if (typeof systemDark.addEventListener === "function") {
      systemDark.addEventListener("change", syncSystemTheme);
    } else if (typeof systemDark.addListener === "function") {
      systemDark.addListener(syncSystemTheme);
    }
  }

  function revealOnScroll() {
    var revealItems = document.querySelectorAll(".section-reveal");

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.14
    });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  initTheme();
  bindThemeToggle();
  revealOnScroll();
}());
