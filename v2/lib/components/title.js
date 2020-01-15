function drawTitle(plotContext, config, styles) {
  let title = config.title;
  let [width, height, margins] = styles.margins;
  let titleRect = {
    x: margins.left,
    y: 0,
    width: width - margins.right,
    height: margins.top
  };
  const midpoint = (titleRect.x + titleRect.width) / 2;

  restoreContext(plotContext, ctx => {
    ctx.fillStyle = styles.backgroundColor;
    ctx.fillRect(titleRect.x, titleRect.y, titleRect.width, titleRect.height);

    ctx.translate(midpoint, 0);
    renderText(ctx, config.title, {
      font: styles.title,
      textAlignment: "center"
    });
  });
}
