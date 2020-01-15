import { systemFont } from './utils/text.js';
import './types.js';

/** @type ManhattanPlotConfig */
export const defaultConfig = {
    title: 'Plot',
    behaviors: {
        zoom: false,
        pan: false,
        selectableAreas: [],
    },
    events: {
        onZoom: null,
        onPan: null,
        onSelect: null,
    },
    axis: {
        x: {
            title: 'X-Axis',
            extent: null,
            tickFormat: num => num.toLocaleString()
        },
        y: {
            title: 'Y-Axis',
            extent: null,
            tickFormat: num => num.toLocaleString()
        },
    },
    tooltips: {
        point: d => {},
        gene: d => {},
    },
    window: {
        x0: 0,
        x1: 0,
        y0: 0,
        y1: 0,
    }
}

/** @type ManhattanPlotStyle */
export const defaultStyles = {
    backgroundColor: '#ffffff',
    margins: {
        left: 40,
        right: 0,
        top: 40,
        bottom: 40
    },
    font: {
        title: `14px ${systemFont}`,
        axisTitle: `12px ${systemFont}`,
        default: `10px ${systemFont}`,
    },
    point: {
        primary?: {color: 'steelblue', size: 4},
        secondary?: {color: 'rebeccapurple', size: 4},
    },
    threshold: {
        lineWidth: 2,
        color: '#ddd',
        opacity: '0.5',
    },
    gene: {
        color: 'green',
        visibleRows: 5,
    },
};

