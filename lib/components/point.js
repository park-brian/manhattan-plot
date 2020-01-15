function drawPoints(plotContext, data, config, styles) {
  const { primary, secondary } = data;
  const { margins, point } = styles;
  const { color: color, size: size } = point.primary;
  const { color: color2, size: size2 } = point.secondary;
  const { scale: xScale } = config.axis.x;
  const { scale: yScale, secondaryScale: yScale2 } = config.axis.y;

  restoreContext(plotContext, ctx => {
    ctx.translate(margins.left, margins.top);

    ctx.beginPath();
    for (let i = 0; i < primary.x.length; i++) {
      let x = xScale(primary.x[i]);
      let y = yScale(primary.y[i]);
      if (x < 0 || x > innerWidth || y < 0 || y > innerHeight) continue;

      ctx.moveTo(x, y);
      ctx.arc(x, y, size, 0, 2 * Math.PI, true);
    }
    ctx.fillStyle = color;
    ctx.fill();

    if (!secondary) return;

    ctx.beginPath();
    for (let j = 0; j < secondary.x.length; j++) {
      let x = xScale(secondary.x[j]);
      let y = yScale2(secondary.y[j]);
      if (x < 0 || x > innerWidth || y < 0 || y > innerHeight) continue;

      ctx.moveTo(x, y);
      ctx.arc(x, y, size2, 0, 2 * Math.PI, true);
    }
    ctx.fillStyle = color2;
    ctx.fill();
  });
}

function enablePointTooltips(plotContext, data, config, styles) {
  let values = data.primary.concat(data.secondary);
  let tooltip = new Tooltip();
  let hitAreas = values.map(point => {
    let size = styles.point.size * 2;
    let x0 = xScale(point.x);
    let y0 = yScale(point.y);
    let x1 = x0 + size;
    let y1 = y0 + size;
    return { x0, y0, x1, y1, point };
  });

  addEventListener(plotContext.canvas, "mousemove", ev => {
    let x = ev.offsetX - margins.left;
    let y = ev.offsetY - margins.top;
    let hitArea = hitAreas.find(a =>
      (x >= a.x0 && x <= a.x1) &&
      (y >= a.y0 && y <= a.y1)
    );
    if (!hitArea) return;
    const tooltipContent = config.tooltip(hitArea.point);
    tooltip.show(ev.clientX, ev.clientY, tooltipContent);
  });

  addEventListener(document.body, "click", ev => tooltip.remove());
}
