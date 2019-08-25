import { extent, indexToColor } from './utils.js';
import { getScale } from './scale.js';
import { axisLeft, axisBottom } from './axis.js';

export class ManhattanPlot {
  constructor(canvas, config) {
    if (!canvas || canvas.constructor !== HTMLCanvasElement)
      throw('Please provide a canvas as the first argument to ManhattanPlot')
    
    this.canvas = canvas;
	this.overlayCanvas = document.createElement('canvas');
	this.elementPickerCanvas = document.createElement('canvas');

    this.ctx = canvas.getContext('2d');
    this.backingCtx = backingCanvas.getContext('2d');
    
	this.config = config;
	this.draw();
  }
  
  draw() {
	// initialize both canvas and backing canvas (used for selection)
    const canvas = this.canvas;
	const backingCanvas = this.backingCanvas;
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
	backingCanvas.width = canvasWidth;
	backingCanvas.height = canvasHeight;
	
    const margins = {
      top: 20,
      right: 20,
      bottom: 40,
      left: 40,
    };

    const width = canvasWidth - margins.left - margins.right;
    const height = canvasHeight - margins.top - margins.bottom;

    const ctx = this.ctx;
	const backingCtx = backingCanvas.getContext('2d');
    const data = this.config.data;
    const config = this.config;

    const xData = data.map(e => e[config.xAxis.key]);
    const yData = data.map(e => e[config.yAxis.key]);

    const xScale = getScale(
      config.xAxis.extent || extent(xData),
      [0, width]
    );
    const yScale = getScale(
      config.yAxis.extent || extent(yData),
      [height, 0]
    );
	
	const pointSize = config.point.size;
	const pointColor = config.point.color;
	
	ctx.save();
	backingCtx.save();
	
	// translate scatter points by left/top margin
	
	ctx.translate(margins.left, margins.top);
	backingCtx.translate(margins.left, margins.top);

	// draw points on canvas and backing canvas
	for (let i = 0; i < data.length; i ++) {
		const d = data[i];
		const x = xScale(xData[i]);
		const y = yScale(yData[i]);
        ctx.beginPath();
        ctx.arc(x, y, pointSize, 0, 2 * Math.PI, true);
		
		ctx.fillStyle = typeof pointColor === 'function'
			? pointColor (d, i)
			: pointColor;
			
        ctx.fill();
	
        backingCtx.beginPath();
        backingCtx.arc(x, y, pointSize, 0, 2 * Math.PI, true);
		backingCtx.fillStyle = indexToColor(i);
        backingCtx.fill();
	}

	ctx.restore();
	backingCtx.restore();
	
	
    
	
	
    console.log(this.ctx, this.config);
  }
  
  
  
}