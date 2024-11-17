/**
 * @param {HTMLElement} element
 * @returns {string}
 */
export function getA11ySnapshot(element: HTMLElement) {
  /**
   * @param {HTMLElement} el
   * @returns {string}
   */
  function getAriaRole(el: HTMLElement) {
    return (
      el.getAttribute("role") ||
      {
        h1: "heading",
        h2: "heading",
        h3: "heading",
        h4: "heading",
        h5: "heading",
        h6: "heading",
        ul: "list",
        ol: "list",
        li: "listitem",
        a: "link",
        button: "button",
        form: "form",
        input:
          el.getAttribute("type") === "checkbox"
            ? "checkbox"
            : el.getAttribute("type") === "radio"
              ? "radio"
              : "textbox",
        textarea: "textbox",
        img: "img",
        table: "table",
        thead: "rowgroup",
        tbody: "rowgroup",
        section: "group",
        progress: "progressbar",
        p: "paragraph",
        tr: "row",
        th: "columnheader",
        td: "cell",
      }[el.tagName.toLowerCase()] ||
      ""
    );
  }

  /**
   * @param {HTMLElement} el
   * @returns {string}
   */
  function getAccessibleName(el: HTMLElement) {
    const alt = el.tagName === "IMG" ? el.getAttribute("alt") : "";
    const ariaLabel = el.getAttribute("aria-label") ?? "";
    const labelId = el.getAttribute("aria-labelledby");
    const byLabel = labelId
      ? (document.getElementById(labelId)?.textContent?.trim() ?? "")
      : "";

    const inputLabel =
      el.tagName === "INPUT" || el.tagName === "TEXTAREA"
        ? (el.closest("label")?.textContent ?? "")
        : "";
    const idLabel = el.id
      ? document.querySelector(`label[for="${el.id}"]`)?.textContent?.trim()
      : "";

    // https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/#namingtechniques
    const textLabel = [
      "button",
      "cell",
      "checkbox",
      "columnheader",
      "gridcell",
      "heading",
      "link",
      "menuitem",
      "menuitemcheckbox",
      "menuitemradio",
      "option",
      "radio",
      "row",
      "rowheader",
      "switch",
      "tab",
      "tooltip",
    ].includes(getAriaRole(el))
      ? el.textContent?.trim()
      : "";

    return (
      alt || ariaLabel || byLabel || inputLabel || idLabel || textLabel || ""
    );
  }

  /**
   * @param {HTMLElement} el
   * @param {number} [depth=0]
   * @returns {string}
   */
  function processElement(el: HTMLElement, depth = 0) {
    if (el === null || el === undefined || el.ariaHidden == "true" || el.hidden)
      return "";
    const role = getAriaRole(el);

    if (role === "presentation") return "";

    const name = getAccessibleName(el);
    let result = role
      ? `${"  ".repeat(depth) + role + (name ? `: "${name}"` : "")} ${el.hasAttribute("disabled") ? ":disabled" : ""} ${el instanceof HTMLProgressElement ? `[value=${el.value}]` : ""} ${el instanceof HTMLInputElement ? (["checkbox", "radio"].includes(role) ? `[checked=${el.checked}]` : `[value=${el.value}]`) : role === "tab" && el.ariaSelected === "true" ? "[aria-selected=true]" : role === "progressbar" ? `[aria-valuenow=${el.getAttribute("aria-valuenow")}]` : ""}\n`
      : "";

    for (const child of Array.from(el.children)) {
      if (child instanceof HTMLElement) {
        result += processElement(child, depth + (role ? 1 : 0));
      }
    }

    return result;
  }

  return processElement(element).trim();
}
