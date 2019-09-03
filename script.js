import { ManhattanPlot } from './manhattan-plot.js';
import { systemFont } from './text.js';

(async function main() {
  let response = await fetch('summary.json').then(e => e.json());
  let ranges = await fetch('ranges.json').then(e => e.json());
  ranges = ranges.filter(e => e.chr <= 22); // filter out chromosomes 23+ for now

  let data = response.data;
  let columnIndexes = {
    chr: response.columns.indexOf('chr'),
    bpAbs1Mb: response.columns.indexOf('bp_abs_1000kb'),
    nLogP2: response.columns.indexOf('nlog_p2')
  };
  let withKeys = data => ({
    chr: data[columnIndexes.chr],
    bpAbs1Mb: data[columnIndexes.bpAbs1Mb],
    nLogP2: data[columnIndexes.nLogP2],
  })

  let config = {
    data: data,
    xAxis: {
      title: [{text: `Ewing's Sarcoma`, font: `600 14px ${systemFont}`}],
      key: columnIndexes.bpAbs1Mb,
      ticks: ranges.map(r => r.max_bp_abs),
      tickFormat: (tick, i) => ranges[i].chr,
      labelsBetweenTicks: true,
      allowSelection: true,
      onSelected: (range, i) => {
        console.log('selected x axis section', range, i)
      }
    },
    yAxis: {
      title: [
        {text: `-log`, font: `600 14px ${systemFont}`},
        {text: '10', textBaseline: 'middle', font: `600 10px ${systemFont}`},
        {text: `(p)`, font: `600 14px ${systemFont}`}
      ],
      key: columnIndexes.nLogP2,
      tickFormat: tick => (tick).toFixed(3),
    },
    point: {
      size: 4,
      opacity: 0.6,
      color: (d, i) => d[columnIndexes.chr] % 2 ? '#005ea2' : '#e47833',
      tooltip: {
        trigger: 'click',
        class: 'custom-tooltip',
        style: 'width: 300px;',
        content: async data => {
          let obj = withKeys(data);
          return `<pre>${JSON.stringify(obj, null, 2)}</pre>`;
        }
      },
      onClick: data => {
        console.log('clicked', data);
      }
    },
    allowZoom: true,
    onZoom: e => console.log(e),
  };

  let container = document.querySelector('#plot-container');
  let plot = new ManhattanPlot(container, config);
})();
