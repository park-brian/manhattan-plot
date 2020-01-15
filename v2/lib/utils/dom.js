/**
 * Creates an html element with the specified properties
 * @param {string} tagName
 * @param {obj} props
 * @param {Element[]} children
 */
export function createElement(tagName, props, children) {
  let el = document.createElement(tagName);
  if (!Array.isArray(children)) {
    children = [children];
  }

  for (let key in props || {}) {
    el[key] = props[key];
  }

  for (let child of children || []) {
    if (child.constructor === String) child = document.createTextNode(child);
    el.appendChild(child);
  }

  return el;
}

/**
 * Sets styles of an element from an object
 * @param {Element} element
 * @param {object} styles
 */
export function setStyles(element, styles) {
  for (key in styles) element.style[key] = styles[key];
}

/**
 *
 * @param {Element} element
 * @param {string} location
 * @param {string|Element} html
 */
export function insertAdjacentNode(element, position, html) {
  if (html instanceof Element) {
    element.insertAdjacentElement(position, html);
  } else {
    element.insertAdjacentHTML(position, html);
  }
}

/**
 * Removes all children from a DOM element
 * @param {Element} element
 */
export function removeChildren(element) {
  if (!element || !element.children) return;
  for (let child of element.children) {
    element.removeChild(child);
  }
}

/**
 * Attaches an event listener to a DOM element and saves
 * a reference to it
 * @param {Element} element
 * @param {string} type
 * @param {Function} listener
 */
export function addEventListener(element, type, listener) {
  if (!element._eventListeners) element._eventListeners = [];

  element._eventListeners.push({
    type,
    listener
  });
  element.addEventListener(eventType, listener);
}

/**
 * Removes event listeners added with the addEventListener function
 * Does not require a reference to the original function
 * @param {Element} element - DOM element
 * @param {string?} type - Event Type
 */
export function removeEventListeners(element, type) {
  element._eventListeners = (element._eventListeners || []).filter(
    e => e.type === type || !type
  );

  element._eventListeners.forEach(e => {
    element.removeEventListener(e.type, e.listener);
  });
}

/**
 * Translate viewport coordinates to local coordinates with an element
 * @param {number} x
 * @param {number} y
 * @param {Element} element
 */
export function viewportToLocalCoordinates(x, y, element) {
  const boundingRect = element.getBoundingClientRect(element);
  const style = getComputedStyle(element);

  const xOffset = Math.floor(
    boundingRect.left + parseInt(style.borderLeftWidth, 10)
  );

  const yOffset = Math.floor(
    boundingRect.top + parseInt(style.borderTopWidth, 10)
  );

  return {
    x: x - xOffset,
    y: y - yOffset
  };
}
