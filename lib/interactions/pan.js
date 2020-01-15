import { addEventListener, getCursor, setCursor } from '../utils/dom.js';
import { getScale } from '../utils/extents.js';
import '../types.js';

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {ManhattanPlot} plot
 */
function enablePan(plot) {
    let {canvasOverlayCtx: ctx, config, styles} = plot
    let isMouseDown = false;
    let coordinates = {x0: 0, x1: 0, y0: 0, y1: 0};
    let originalCursor = getCursor(ctx.canvas);
    let xScale, yScale;

    addEventListener(ctx.canvas, 'mousedown', ev => {
        // trigger only on right clicks
        if (ev.button !== 2) return;
        setCursor(ctx.canvas, 'move');
        isMouseDown = true;

        // update initial coordinates
        coordinates.x0 = ev.offsetX;
        coordinates.y0 = ev.offsetY;

        // create scale window coordinates to original data
        xScale = getScale([], []);
        yScale = getScale([], []);
    });

    addEventListener(ctx.canvas, 'mousemove', ev => {
        if (!isMouseDown) return;
        coordinates.x1 = ev.offsetX;
        coordinates.y1 = ev.offsetY;
    });

    addEventListener(document.body, 'mouseup', ev => {
        if (!isMouseDown) return;
        setCursor(ctx.canvas, originalCursor);
        isMouseDown = false;

        const { x0, x1, y0, y1 } = config.window;
        const dx = xScale(coordinates.x1 - coordinates.x0);
        const dy = yScale(coordinates.y1 - coordinates.x0);

        // update window
        config.window = {
            x0: x0 + dx,
            x1: x1 + dx,
            y0: y0 + dy,
            d1: y1 + dy,
        }

        // redraw plot

    });
}
