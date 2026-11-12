/* =====================================================================
   VANGUARD — Hero Controller & Mobile Menu Interaction
   ===================================================================== */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const burgerBtn = document.getElementById("vanguard-burger");
    const closeBtn = document.getElementById("vanguard-close");
    const mobileMenu = document.getElementById("vanguard-mobile-menu");
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];

    if (!burgerBtn || !mobileMenu) return;

    function openMenu() {
      mobileMenu.classList.add("is-open");
      mobileMenu.setAttribute("aria-hidden", "false");
      burgerBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      if (closeBtn) closeBtn.focus();
    }

    function closeMenu() {
      mobileMenu.classList.remove("is-open");
      mobileMenu.setAttribute("aria-hidden", "true");
      burgerBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      burgerBtn.focus();
    }

    burgerBtn.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
        closeMenu();
      }
    });
  });
})();
