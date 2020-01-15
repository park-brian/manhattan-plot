
/**
 * @typedef {{
    gene_id: number,
    name: string,
    strand: string,
    tx_start: number,
    tx_end: number,
    exon_starts: number[],
    exon_ends: number[],
  }} GeneData
 */

/**
 * @typedef {{
    x: number,
    y: number,
    data?: any
  }} PointData
*/

/**
 * @typedef {{
    x0: number,
    x1: number,
    y0: number,
    y1: number,
    data?: any
  }} Rect
 */

/**
 * @typedef {{
    primary: {x: number[], y: number[]},
    secondary?: {x: number[], y: number[]},
    genes?: GeneData[]
   }} ManhattanPlotData
 */

/**
 * @typedef {{
    title?: string,
    extent?: [number, number],
    ticks?: (number[]|{value: number, label: string})[],
    tickFormat?: ({value: number}) => string
  }} ManhattanPlotAxisConfig
 */

/**
 * @typedef {{
    title?: string,
    behaviors?: {
      zoom?: Boolean,
      pan?: Boolean,
      selectableAreas?: Rect[]
    },
    events?: {
      onZoom?: (Rect) => any,
      onPan?: (Rect) => any,
      onSelect?: (Rect) => any,
    },
    axis?: {
      x: ManhattanPlotAxisConfig,
      y: ManhattanPlotAxisConfig,
    },
    tooltips?: {
      point: (data: PointData) => Element|Promise<Element>,
      gene: (data: GeneData) => Element|Promise<Element>,
    }
  }} ManhattanPlotConfig
 */

/**
  @typedef {{
    lineWidth?: number,
    color?: string,
    opacity?: number,
    lineDash?: number[]
  }} StrokeStyle
*/

/**
 * @typedef {{
    backgroundColor?: string,
    width?: number,
    height?: number,
    font?: {
      title?: string,
      axisTitle?: string,
      default?: string,
    },
    point: {
      primary?: {color: string, size: number},
      secondary?: {color: string, size: number},
    },
    gene: {
      color?: string,
      visibleRows?: number,
    },
    axis: {
      x?: {lineWidth: number, tickLabelPlacement: string},
      y?: {lineWidth: number, tickLabelPlacement: string},
      delimiter?: StrokeStyle,
    },
    threshold?: StrokeStyle,
    margins?: {
      left?: number,
      right?: number,
      top?: number,
      bottom?: number
    }
  }} ManhattanPlotStyles
 */