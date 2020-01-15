import { drawXAxis, drawYAxis } from "./components/axis.js";
import { drawBackground } from "./components/background.js";
import { drawTitle } from "./components/title.js";
import { drawThreshold } from "./components/threshold.js";
import { drawGenes } from "./components/gene-plot.js";
import { drawPoints } from "./elements/point.js";
import { getExtents, getScale, getTicks } from "./utils/extents.js";
import {
  create2dContext,
  removeChildren,
  removeEventListeners,
  setStyles
} from "./utils/dom.js";
import { canvasToBlob } from "./utils/canvas.js";

import { enablePan } from "./interactions/pan.js";
import { enableSelectableAreas } from "./interactions/select-area.js";
import { enableZoom } from "./interactions/zoom.js";
import 'types.js';

export class ManhattanPlot {
  /**
   * Creates a Manhattan Plot
   * @param {Element} container
   * @param {ManhattanPlotData} data
   * @param {ManhattanPlotConfig} config
   * @param {ManhattanPlotStyles} styles
   */
  constructor(container, data, config, styles) {
    this.container = container;
    this.data = data;
    this.config = config;
    this.styles = styles;

    this.plotContext = create2dContext();
    this.plotOverlayContext = create2dContext();

    this.genePlotContext = create2dContext();
    this.genePlotOverlayContext = create2dContext();

    this.draw();
    this.initEvents();
  }

  draw() {
    this.initSize();
    this.initExtents();
    this.initScales();
    drawBackground(plotContext, styles);
    drawBackground(genePlotContext, styles);
    drawTitle(plotContext, config, styles);
    drawThreshold(plotContext, data, config, styles);
    drawPoints(plotContext, data, config, styles);
    drawXAxis(plotContext, data, config, styles);
    drawYAxis(plotContext, data, config, styles);
    drawGenes(genePlotContext, data, config, styles);
  }

  redraw(addEvents) {
    this.styles.width = null;
    this.styles.height = null;
    this.draw();
    if (addEvents) this.initEvents();
  }

  async export(width, height, filename) {
    const container = document.createElement("div");
    setStyles(container, { width, height });
    const plot = new ManhattanPlot(
      container,
      this.data,
      this.config,
      this.styles
    );
    const exportContext = create2dContext();
    const exportCanvas = exportContext.canvas;

    const blob = await canvasToBlob(exportContext.canvas);
    // saveAs(blob, filename || 'export.png');
  }

  reset() {
    this.styles.width = null;
    this.styles.height = null;
    this.config.axis.x.extents = null;
    this.config.axis.y.extents = null;
    this.config.axis.x.ticks = null;
    this.config.axis.y.ticks = null;
    this.config.axis.x.scale = null;
    this.config.axis.y.scale = null;
    this.draw();
    this.initEvents();
  }

  initSize() {
    const container = this.container;
    const styles = this.styles;

    if (!styles.margins)
      styles.margins = { left: 40, right: 0, top: 40, bottom: 20 };

    if (!styles.width) {
      styles.width = container.clientWidth;
      styles.innerWidth = styles.width - margins.left - margins.right;
    }

    if (!styles.height) {
      styles.height = container.clientHeight;
      styles.innerHeight = styles.height - margins.top - margins.bottom;
    }
  }

  initExtents() {
    const data = this.config.data;
    const xAxis = this.config.axis.x;
    const yAxis = this.config.axis.y;
    let xData = data.primary.x;
    let yData = data.primary.y;

    if (data.secondary) {
      xData = xData.concat(data.secondary.x);
      yData = yData.concat(data.secondary.y);
    }

    if (!xAxis.extents) xAxis.extents = getExtents(xData);

    if (!yAxis.extents) yAxis.extents = getExtents(yData);

    if (!xAxis.ticks) xAxis.ticks = getTicks(xData);

    if (!yAxis.ticks) yAxis.ticks = getTicks(yData);
  }

  initScales() {
    const xAxis = this.config.axis.x;
    const yAxis = this.config.axis.y;
    const { margins, width, height } = this.styles;
    const innerWidth = width - margins.left - margins.right;
    const innerHeight = height - margins.top - margins.bottom;

    if (!xAxis.scale) {
      xAxis.scale = getScale(xAxis.extents, [0, innerWidth]);
    }

    if (!yAxis.scale) {
      if (!data.secondary) {
        yAxis.scale = getScale(yAxis.extents, [innerHeight, 0]);
      } else {
        // create a secondary scale if plotting mirrored data
        yAxis.scale = getScale(yAxis.extents, [innerHeight / 2, 0]);
        yAxis.secondaryScale = getScale(yAxis.extents, [
          innerHeight / 2,
          innerHeight
        ]);
      }
    }
  }

  initEvents() {
    const { behaviors, tooltips } = this.config;
    removeEventListeners(document.body);
    removeEventListeners(plotOverlayContext);
    removeEventListeners(genePlotOverlayContext);

    if (tooltips.point)
      enablePointTooltips(plotOverlayContext, data, config, styles);

    if (tooltips.gene) enableGeneTooltips(plotContext, data, config, styles);

    if (behaviors.zoom)
      // selection zoom
      enableZoom(plotOverlayContext);

    if (behaviors.pan) enablePan(plotOverlayContext);

    if (behaviors.selectableAreas)
      enableSelectableAreas(plotContext, behaviors.selectableAreas);
  }

  destroy() {
    removeChildren(this.container);
    removeEventListeners(document.body);
    removeEventListeners(plotOverlayContext);
    removeEventListeners(genePlotOverlayContext);

    delete this.data;
    delete this.config;
    delete this.styles;

    delete this.plotContext;
    delete this.genePlotContext;

    delete this.plotOverlayContext;
    delete this.genePlotOverlayContext;
  }
}
