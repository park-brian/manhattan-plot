/**
 * Creates a new canvas and 2d rendering context
 * @returns {CanvasRenderingContext2D} A 2D rendering context
 */
export function create2dContext() {
  return document.createElement("canvas").getContext("2d");
}

/**
 * Clears the contents of a canvas context
 * @param {CanvasRenderingContext2D} ctx
 */
export function clear(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * Fills a canvas context with the specified color
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} color
 */
export function fill(ctx, color) {
  restoreContext(ctx, ctx => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  })
}


/**
 * Promisifies the canvasToBlob method
 * @param {HTMLCanvasElement} canvas
 * @param {string} mimeType
 * @param {any} qualityArgument
 */
export function canvasToBlob(canvas, mimeType, qualityArgument) {
  return new Promise(resolve =>
    canvas.toBlob(resolve, mimeType, qualityArgument)
  );
}

/**
 * Executes a function within a new canvas drawing state,
 * restoring the previous state once the callback finishes
 * @param {CanvasRenderingContext2D} context
 * @param {(ctx: CanvasRenderingContext2D) => any} callback
 * @returns {any} The result of the callback
 */
export function restoreContext(context, callback) {
  if (!context) return;
  context.save();
  const result = callback(context);
  if (typeof result === Promise) result.then(e => context.restore());
  else context.restore();
  return result;
}
