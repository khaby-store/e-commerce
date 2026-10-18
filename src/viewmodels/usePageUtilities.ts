"use client";

import { useEffect } from "react";
import { isValidEmail } from "@/models/pageUtilities";

/**
 * Wires three captured chrome controls that ship without behavior:
 * - the header search form: Enter must not reload the page (the replica has
 *   no search-results route; the captured clear button already works as a
 *   native form reset),
 * - the footer back-to-top button (`button.XqMzq` — its captured
 *   `href="#back-to-top"` sits on a `<button>`, which browsers ignore),
 * - the footer email sign-up: validate the address, then swap the capture's
 *   hidden "You're in!" success block in for the form row; its close button
 *   restores the form.
 */
export function usePageUtilities() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    // --- search: block the implicit submit (no results route) --------------
    const searchForm = document.getElementById("keyword-search-form");
    if (searchForm) {
      const onSubmit = (event: Event) => event.preventDefault();
      searchForm.addEventListener("submit", onSubmit);
      cleanups.push(() => searchForm.removeEventListener("submit", onSubmit));
    }

    // --- back to top --------------------------------------------------------
    const backToTop = document.querySelector<HTMLButtonElement>("button.XqMzq");
    if (backToTop) {
      const onClick = () => window.scrollTo({ top: 0, behavior: "smooth" });
      backToTop.addEventListener("click", onClick);
      cleanups.push(() => backToTop.removeEventListener("click", onClick));
    }

    // --- email sign-up ------------------------------------------------------
    const newsletter = document.querySelector<HTMLElement>("div.tfCi0");
    if (newsletter) {
      const form = newsletter.querySelector<HTMLElement>("div._wqmZ");
      const success = newsletter.querySelector<HTMLElement>("div.gctgi");
      const input = newsletter.querySelector<HTMLInputElement>(
        'input[name="email-module-input"]',
      );
      const signUp = form?.querySelector<HTMLButtonElement>("button");
      const close = success?.querySelector<HTMLButtonElement>("button.EV4My");
      if (form && success && input && signUp && close) {
        const clearError = () => {
          input.setAttribute("aria-invalid", "false");
          input.style.borderColor = "";
        };
        const onSignUp = () => {
          if (isValidEmail(input.value)) {
            form.style.display = "none";
            success.style.display = "block";
            input.value = "";
            clearError();
            return;
          }
          // No captured error copy exists, so signal via the ARIA state the
          // input already ships plus the critical border token it styles to.
          input.setAttribute("aria-invalid", "true");
          input.style.borderColor = "var(--ndls-color-border-critical)";
          input.focus();
        };
        const onInputKeyDown = (event: KeyboardEvent) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onSignUp();
          }
        };
        const onClose = () => {
          success.style.display = "none";
          form.style.display = "";
          clearError();
        };

        signUp.addEventListener("click", onSignUp);
        input.addEventListener("keydown", onInputKeyDown);
        close.addEventListener("click", onClose);
        cleanups.push(() => {
          signUp.removeEventListener("click", onSignUp);
          input.removeEventListener("keydown", onInputKeyDown);
          close.removeEventListener("click", onClose);
          // Leave the captured DOM as we found it on unmount.
          success.style.display = "";
          form.style.display = "";
          clearError();
        });
      }
    }

    return () => {
      for (const off of cleanups) off();
    };
  }, []);
}
