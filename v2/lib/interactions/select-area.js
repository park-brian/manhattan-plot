import { addEventListener } from "./utils/dom.js";
import { clear, restoreContext } from "../utils/canvas.js";

/**
 * Enables the user to select rectangular regions on a canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {{x0: number, x1: number, y0: number, y1: number, data: any}[]} areas
 */
export function enableSelectableAreas(ctx, areas, config, styles) {
  const getAreas = (x, y) =>
    areas.filter(a => x >= a.x0 && x <= a.x1 && y >= a.y0 && y <= a.y1);

  addEventListener(ctx.canvas, "mousemove", ev => {
    clear(ctx);
    let matchingAreas = getAreas(ev.offsetX, ev.offsetY);
    if (!matchingAreas) return;

    restoreContext(ctx, ctx => {
      let areaStyles = styles.selectable || { color: "#ddd", opacity: 0.5 };
      let area = matchingAreas[0];

      ctx.globalAlpha = areaStyles.opacity;
      ctx.fillStyle = areaStyles.color;
      ctx.fillRect(area.x0, area.y0, area.x1 - area.x0, area.y1 - area.y0);
    });
  });

  addEventListener(ctx.canvas, "click", ev => {
    clear(ctx);
    let matchingAreas = getAreas(ev.offsetX, ev.offsetY);
    if (!matchingAreas) return;

    if (config.events.onSelect) config.events.onSelect(matchingAreas[0].data);
  });
}
