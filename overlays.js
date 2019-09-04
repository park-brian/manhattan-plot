import { viewportToLocalCoordinates } from './utils.js';

export function drawSelectionOverlay(config, ctx, overlayCtx) {
  let canvas = ctx.canvas;
  let overlayCanvas = overlayCtx.canvas;
  overlayCtx.globalAlpha = 0.1;

  let xScale = config.xAxis.scale;
  let xInverseScale = config.xAxis.inverseScale;
  let margins = config.margins;
  let ticks = config.xAxis.ticks;
  let selectedBounds = null;
  if (ticks[0] != 0) ticks.unshift(0);

  canvas.addEventListener('mousemove', ev => {
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    let {x, y} = viewportToLocalCoordinates(ev.clientX, ev.clientY, ev.target);
    let scaledX = xInverseScale(x - margins.left);
    let withinMargins = isWithinMargins(x, y, canvas, margins);
    selectedBounds = getSectionBounds(scaledX, ticks);

    if (withinMargins && selectedBounds) {
      let xPosition = xScale(selectedBounds[0]);
      let width = xScale(selectedBounds[1] - selectedBounds[0]);
      let height = overlayCanvas.height - config.margins.bottom - config.margins.top;
      overlayCtx.fillRect(1 + margins.left + xPosition, margins.top, width, height)
    }1
  });

  canvas.addEventListener('click', ev => {
    let {x, y} = viewportToLocalCoordinates(ev.clientX, ev.clientY, ev.target);
    let withinMargins = isWithinMargins(x, y, canvas, margins);
    if (withinMargins && selectedBounds && config.xAxis.onSelected)
      config.xAxis.onSelected(selectedBounds, ticks.indexOf(selectedBounds[0]))
  });
}

export function drawZoomOverlay(config, ctx, overlayCtx) {
    let canvas = ctx.canvas;
    overlayCtx.globalAlpha = 0.5;
    overlayCtx.globalCompositeOperation = 'copy';

    let margins = config.margins;
    let xInverseScale = config.xAxis.inverseScale;
    let yInverseScale = config.yAxis.inverseScale;
    let zoomArea = { x1: 0, x2: 0, y1: 0, y2: 0 };
    let mouseDown = false;

    canvas.addEventListener('mousedown', ev => {
      let {x, y} = viewportToLocalCoordinates(ev.clientX, ev.clientY, ev.target);
      let withinMargins = isWithinMargins(x, y, canvas, margins);
      if (withinMargins) {
        mouseDown = true;
        zoomArea = {
          x1: x,
          x2: x,
          y1: y,
          y2: y,
        }
      }
    });

    canvas.addEventListener('mousemove', ev => {
      let {x, y} = viewportToLocalCoordinates(ev.clientX, ev.clientY, ev.target);
      let withinMargins = isWithinMargins(x, y, canvas, margins);
      if (!mouseDown ||
        Math.abs(x - zoomArea.x1) < 10 ||
        Math.abs(y - zoomArea.y1) < 10)
        return false;

      zoomArea.x2 = x;
      zoomArea.y2 = y;

      overlayCtx.fillRect(
        margins.left,
        margins.top,
        canvas.width - margins.left - margins.right,
        canvas.height - margins.top - margins.bottom
      );

      overlayCtx.clearRect(
        Math.min(zoomArea.x1, zoomArea.x2),
        Math.min(zoomArea.y1, zoomArea.y2),
        Math.abs(zoomArea.x2 - zoomArea.x1),
        Math.abs(zoomArea.y2 - zoomArea.y1)
      )
    });

    canvas.addEventListener('mouseup', ev => {
      overlayCtx.clearRect(0, 0, canvas.width, canvas.height);
      mouseDown = false;
      let { x1, x2, y1, y2 } = zoomArea;

      // order coordinates so that x1 < x2, y2 < y2, and subtract margins
      x1 = Math.min(x1, x2) - margins.left;
      x2 = Math.max(x2, x2) - margins.left;
      y1 = Math.min(y1, y2) - margins.top;
      y2 = Math.max(y1, y2) - margins.top;

      // make sure coordinates are within bounds
      x1 = Math.max(x1, 0);
      y1 = Math.max(y1, 0);
      x2 = Math.min(x2, canvas.width - margins.right - margins.left);
      y2 = Math.min(y2, canvas.height - margins.top - margins.bottom);

      // apply inverse scales to determine original data bounds
      let xMax = xInverseScale(x1);
      let xMin = xInverseScale(x2);
      let yMax = yInverseScale(y1);
      let yMin = yInverseScale(y2);

      const window = {
        coordinates: {x1, x2, y1, y2},
        bounds: {xMin, xMax, yMin, yMax}
      };

      config.setZoomWindow && config.setZoomWindow(window);
      config.onZoom && config.onZoom(window);
    });

    canvas.addEventListener('dblclick', ev => {
      config.zoomWindow = null;
    });
}

function getSectionBounds(value, ticks) {
    for (let i = 0; i < ticks.length - 1; i ++) {
      let pair = [ticks[i], ticks[i + 1]];
      if (value >= pair[0] && value <= pair[1])
        return pair;
    }
    return null;
}

function isWithinMargins(x, y, canvas, margins) {
    return (
        x > margins.left &&
        x < canvas.width - margins.right &&
        y > margins.top &&
        y < canvas.height - margins.bottom
    );
}
