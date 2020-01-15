export const requestIdleCallback =
  window.requestIdleCallback || window.setTimeout;

export function debounce(callback, interval) {
  let id;
  return function() {
    if (id) clearTimeout(id);
    id = setTimeout(callback.bind(this, ...arguments), interval);
  };
}
