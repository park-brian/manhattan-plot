import { extent, indexToColor, rgbToColor, viewportToLocalCoordinates } from './utils.js';
import { getScale } from './scale.js';
import { axisLeft, axisBottom } from './axis.js';

export class ManhattanPlot {
  constructor(canvas, config) {
    if (!canvas || canvas.constructor !== HTMLCanvasElement)
      throw 'Please provide a canvas as the first argument to ManhattanPlot';

    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    // create a hidden canvas to be used for selecting points
    this.hiddenCanvas = document.createElement('canvas');
    this.hiddenCtx = this.hiddenCanvas.getContext('2d');

    this.config = config;
    this.draw();
  }

  draw() {
    let time = new Date().getTime();
    const logTime = () => console.log(new Date().getTime() - time);

    const config = this.config;
    const canvas = this.canvas;
    const hiddenCanvas = this.hiddenCanvas;
    const ctx = this.ctx;
    const hiddenCtx = this.hiddenCtx;
    const data = this.config.data;
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;
    const margins = config.margins = {top: 20, right: 20, bottom: 40, left: 40, ...config.margins};
    const width = canvasWidth - margins.left - margins.right;
    const height = canvasHeight - margins.top - margins.bottom;
    const pointMap = config.pointMap = {}; // maps colors to data indexes

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    hiddenCanvas.width = canvasWidth;
    hiddenCanvas.height = canvasHeight;

    const xData = data.map(d => d[config.xAxis.key]);
    const yData = data.map(d => d[config.yAxis.key]);

    if (!config.xAxis.extent)
      config.xAxis.extent = extent(xData);

    if (!config.yAxis.extent)
      config.yAxis.extent = extent(yData);

    const xScale = config.xAxis.scale = getScale(config.xAxis.extent, [0, width]);
    const yScale = config.yAxis.scale = getScale(config.yAxis.extent, [height, 0]);

    ctx.save();
    hiddenCtx.save();

    // translate scatter points by left/top margin
    ctx.translate(margins.left, margins.top);
    hiddenCtx.translate(margins.left, margins.top);

    // draw points on canvas and backing canvas
    const pointSize = config.point.size;
    const pointColor = config.point.color;
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      const x = xScale(xData[i]);
      const y = yScale(yData[i]);

      ctx.beginPath();
      ctx.arc(x, y, pointSize, 0, 2 * Math.PI, true);
      ctx.fillStyle = typeof pointColor === 'function'
        ? pointColor(d, i) : pointColor;
      ctx.fill();

      hiddenCtx.beginPath();
      hiddenCtx.arc(x, y, pointSize, 0, 2 * Math.PI, true);
      const hiddenPointColor = indexToColor(i);
      hiddenCtx.fillStyle = hiddenPointColor;
      pointMap[hiddenPointColor] = d;
      hiddenCtx.fill();
    }

    // draw y axis

    ctx.restore();
    hiddenCtx.restore();
    this.attachEventHandlers(canvas);
    logTime();
  }

  attachEventHandlers(canvas) {
    const config = this.config;

    // change mouse cursor when hovering over a point
    canvas.onmousemove = ev => {
      canvas.style.cursor = this.getPointFromEvent(ev)
        ? 'pointer'
        : 'default';
    }

    // call click event callbacks
    canvas.onclick = ev => {
      const point = this.getPointFromEvent(ev);
      if (!point) return;
      const {tooltip, onClick} = config.point;

      if (onClick)
        onClick(point);

      if (tooltip)
        this.showTooltip(ev, tooltip(point));
    };
  }

  showTooltip(ev, html) {
    console.log('showing tooltip', ev, html);
  }

  getPointFromEvent({clientX, clientY, target}) {
    let {x, y} = viewportToLocalCoordinates(clientX, clientY, target);
    const [r, g, b, a] = this.hiddenCtx.getImageData(x, y, 1, 1).data;
    return a ? this.config.pointMap[rgbToColor(r, g, b)] : null
  }

}
