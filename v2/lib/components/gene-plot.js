export function drawGenes() {}

function enableGeneTooltips(ctx, data, config, styles) {
  let values = data.genes;
  let tooltip = new Tooltip();
  let genes = packGenes(data.genes);
  let hitAreas = [];
  let rowHeight = styles.gene.rowHeight || 50;
  let rowPadding = styles.gene.rowPadding || 5;

  genes.forEach((row, i) =>
    row.forEach(gene =>
      hitAreas.push({
        x0: xScale(gene.txStart),
        x1: xScale(gene.txEnd),
        y0: i,
        y1: i * rowHeight,
        gene
      })
    )
  );

  addEventListener(ctx.canvas, "mousemove", ev => {
    let x = ev.offsetX;
    let y = ev.offsetY;
    let hitArea = hitAreas.find(
      a => x >= a.x0 && x <= a.x1 && y >= a.y0 && y <= a.y1
    );
    if (!hitArea) return;
    const tooltipContent = config.tooltip(hitArea.gene);
    tooltip.show(ev.clientX, ev.clientY, tooltipContent);
  });

  addEventListener(document.body, "click", ev => tooltip.remove());
}
