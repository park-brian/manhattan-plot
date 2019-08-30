import { debounce, extent, indexToColor, rgbToColor, viewportToLocalCoordinates } from './utils.js';
import { getScale } from './scale.js';
import { axisLeft, axisBottom } from './axis.js';

export class ManhattanPlot {
  constructor(container, config) {
    const containerStyle = getComputedStyle(container);
    if (containerStyle.position === 'static')
      container.style.position = 'relative'
    this.container = container;

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    // create a hidden canvas to be used for selecting points
    this.hiddenCanvas = document.createElement('canvas');
    this.hiddenCtx = this.hiddenCanvas.getContext('2d');

    this.config = config;
    this.draw();

    this.tooltip = this.createTooltip();
    this.container.appendChild(this.canvas);
    this.container.appendChild(this.tooltip);
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
    const canvasWidth = this.container.clientWidth;
    const canvasHeight = this.container.clientHeight;
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
    ctx.globalAlpha = config.point.opacity;
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
      const defaultCursor = (config.zoom)
        ? 'crosshair'
        : 'default';
      canvas.style.cursor = this.getPointFromEvent(ev)
        ? 'pointer'
        : defaultCursor;
    };

    // call click event callbacks
    canvas.onclick = async ev => {
      this.hideTooltip();
      const {tooltip, onClick} = config.point;
      const {trigger, content} = tooltip;
      const point = this.getPointFromEvent(ev);
      if (!point) return;

      if (onClick)
        onClick(point);

      if (content && trigger === 'click')
        this.showTooltip(ev, await content(point, this.tooltip));
    };
  }

  createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.classList.add('manhattan-plot-tooltip')
    tooltip.style.display = 'none';
    tooltip.style.position = 'absolute';
    return tooltip;
  }

  showTooltip(ev, html) {
    let {x, y} = viewportToLocalCoordinates(ev.clientX, ev.clientY, ev.target);
    this.tooltip.innerHTML = '';
    this.tooltip.style.display = 'inline-block';
    this.tooltip.style.left = x + 'px';
    this.tooltip.style.top = y + 'px';
    if (html instanceof Element)
      this.tooltip.insertAdjacentElement('beforeend', html);
    else
      this.tooltip.insertAdjacentHTML('beforeend', html);
  }

  hideTooltip() {
    this.tooltip.style.display = 'none';
  }

  getPointFromEvent({clientX, clientY, target}) {
    let {x, y} = viewportToLocalCoordinates(clientX, clientY, target);
    const [r, g, b, a] = this.hiddenCtx.getImageData(x, y, 1, 1).data;
    return a ? this.config.pointMap[rgbToColor(r, g, b)] : null
  }

}
