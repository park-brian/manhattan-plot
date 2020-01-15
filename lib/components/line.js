function drawThreshold(plotContext, data, config, styles) {
  const { scale } = config.axis.y;
  const { margins, innerWidth } = styles;
  const y = scale(data.threshold);

  restoreContext(plotContext, ctx => {
    ctx.translate(margins.left, margins.top);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(innerWidth, y);
    ctx.setLineDash(styles.threshold.dash);
    ctx.stroke();
  });
}
