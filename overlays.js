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
    }
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
    let overlayCanvas = overlayCtx.canvas;

    let xScale = config.xAxis.scale;
    let yScale = config.yAxis.scale;

    let xInverseScale = config.xAxis.inverseScale;
    let yInverseScale = config.yAxis.inverseScale;

    canvas.addEventListener('mousedown', ev => {

    });

    canvas.addEventListener('mousemove', ev => {

    });

    canvas.addEventListener('mouseup', ev => {

    });

    canvas.addEventListener('dblclick', ev => {

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
