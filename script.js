import { ManhattanPlot } from './manhattan-plot.js';

(async function main() {
  let response = await fetch('summary.json').then(e => e.json());
  let ranges = await fetch('ranges.json').then(e => e.json());

  let data = response.data;
  let columnIndexes = {
    chr: response.columns.indexOf('chr'),
    bpAbs1Mb: response.columns.indexOf('bp_abs_1000kb'),
    nLogP2: response.columns.indexOf('nlog_p2')
  };
  
  let config = {
    data: data,
    xAxis: {
      centerLabels: true,
      labelFormatter: val => `CHR ${val}`,
      key: columnIndexes.bpAbs1Mb,
      onSelectGroup: e => console.log(e),
      ticks: ranges.map(r => ({
        label: r.chr,
        value: r.max_bp_abs
      })),
    },
    yAxis: {
      labelFormatter: d => d,
      key: columnIndexes.nLogP2
    },
    point: {
      size: 3,
	  opacity: 0.6,
      color: (d, i) => d[columnIndexes.chr] % 2 ? '#999' : '#444',
      tooltipTrigger: 'click',
      tooltip: () => null,
    },
    onZoom: e => console.log(e),
  };

  let canvas = document.querySelector('canvas');
  let plot = new ManhattanPlot(canvas, config);
})();


