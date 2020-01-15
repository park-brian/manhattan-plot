function enableZoom(ctx, config, styles) {
  let { margins } = styles;
  let isMouseDown = false;
  let extents = { x0: null, x1: null, y0: null, y1: null };

  addEventListener(ctx.canvas, "mousedown", ev => {
    isMouseDown = true;
    extents.x0 = ev.offsetX - margins.left;
    extents.y0 = ev.offsetY - margins.top;
  });

  addEventListener(document.body, "mousemove", ev => {
    const { offsetX, offsetY } = getLocalOffsets(
      ev.clientX,
      ev.clientY,
      ctx.canvas
    );
    extents.x1 = offsetX - margins.left;
    extents.y1 = offsetY - margins.top;
  });

  addEventListener(document.body, "mouseup", ev => {
    if (!isMouseDown) return;
    let inverseXScale = createScale([0, innerWidth], config.axis.x.extents);
    let inverseYScale = createScale([innerHeight, 0], config.axis.y.extents);

    plot.setExtents(
      [inverseXScale(extents.x0), inverseXScale(extents.x1)],
      [inverseYScale(extents.y0), inverseYScale(extents.y1)]
    );
    plot.redraw();
  });
}
