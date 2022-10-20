import GSAP from "gsap";
import each from "lodash/each";

export default class Page {
  constructor({ id, element, elements }) {
    this.selector = element;
    this.selectorChildren = { ...elements };
    this.id = id;
  }

  create() {
    this.element = document.querySelector(this.selector);
    this.elements = {};
    each(this.selectorChildren, (entry, key) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList ||
        Array.isArray(entry)
      ) {
        // if entry is already an actual element or array of any type, save it as is
        this.elements[key] = entry;
      } else {
        // if value is a selector, get the element and save that
        this.elements[key] = document.querySelectorAll(entry);

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry);
        }
      }
    });
    console.log(this.elements);
  }

  show() {
    return new Promise((resolve) => {
      GSAP.from(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      GSAP.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }
}
