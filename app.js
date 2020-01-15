let plotContainer = document.querySelector('#plot');
let plot = null;
let ranges = [];

(async function init() {
    ranges = await fetchJson('./data/ranges.json')
})();

async function fetchJson() {
    const response = await fetch(...arguments);
    return await response.json();
}

async function loadSummaryPlot() {
    const {columns, data} = await fetchJson('./data/summary.json');

    const xKey = columns.indexOf('bp_abs_1000kb');
    const yKey = columns.indexOf('nlog_p2');

    const xData = data.map(e => e[xKey]);
    const yData = data.map(e => e[yKey]);

    console.log({columns, data});

    plot = new ManhattanPlot(
        plotContainer,
        {primary: {x: xData, y: yData}},
    );
}

async function loadSummaryPlot() {
    const {columns, data} = await fetchJson('./data/variants.1.json');

    const xKey = columns.indexOf('bp');
    const yKey = columns.indexOf('nlog_p');

    const xData = data.map(e => e[xKey]);
    const yData = data.map(e => e[yKey]);

    console.log({columns, data});

    plot = new ManhattanPlot(
        plotContainer,
        {primary: {x: xData, y: yData}},
    );

    plot = new ManhattanPlot()
}