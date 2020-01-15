function interpolateTicks(ticks) {
  return ticks.map((tick, index) => {
    let value = tick.value;
    let nextValue = ticks[index + 1].value;
    if (nextValue !== undefined)
      tick.interpolatedValue = (value + nextValue) / 2;
    return tick;
  });
}

function drawXAxis(plotContext, data, config, styles) {
  const { margins, width, height, innerWidth, innerHeight } = styles;
  const { thickness, tickLabelPlacement } = styles.axis;
  const { axisTitle: titleFont, default: defaultFont } = styles.font;
  const tickSize = { height: thickness * 5, width: thickness };

  if (tickLabelPlacement === "between") {
    ticks = interpolateTicks(ticks);
  }

  restoreContext(plotContext, ctx => {
    ctx.translate(margins.left, margins.top + innerHeight);

    // draw axis line
    ctx.fillRect(0, 0, innerWidth, thickness);

    // draw ticks
    ticks.forEach((tick, index) => {
      restoreContext(ctx, ctx => {
        // draw tick marks
        ctx.fillRect(xScale(tick.value), 0, tickSize.width, tickSize.height);

        // draw tick label

        // do not draw label if there is no interpolated value
        if (tickLabelPlacement === "between" && !tick.interpolatedValue) return;

        // go to the label offset
        let value = tick.interpolatedValue || tick.value;
        ctx.translate(xScale(value), tickSize.height);
        renderText(ctx, tick.label, {
          font: styles.title,
          textAlignment: "center"
        });
      });
    });
  });
}

function drawYAxis(plotContext, data, config, styles) {
  const { margins, width, height, innerWidth, innerHeight } = styles;
  const { lineWidth, tickLabelPlacement } = styles.axis;
  const { axisTitle: titleFont, default: defaultFont } = styles.font;
  const tickSize = { height: thickness * 5, width: thickness };

  if (tickLabelPlacement === "between") {
    ticks = interpolateTicks(ticks);
  }

  restoreContext(plotContext, ctx => {
    ctx.translate(margins.left, margins.top);

    // draw axis line
    ctx.fillRect(0, 0, lineWidth, innerHeight);

    // draw ticks
    ticks.forEach((tick, index) => {
      restoreContext(ctx, ctx => {
        // draw tick marks
        ctx.fillRect(
          -tickSize.width,
          yScale(tick.value),
          tickSize.height,
          tickSize.width
        );

        // draw tick label

        // do not draw label if there is no interpolated value
        if (tickLabelPlacement === "between" && !tick.interpolatedValue) return;

        // go to the label offset
        let value = tick.interpolatedValue || tick.value;
        ctx.translate(-tickSize.width, yScale(value));
        renderText(ctx, tick.label, {
          font: styles.title,
          textAlignment: "center"
        });
      });
    });
  });
}
