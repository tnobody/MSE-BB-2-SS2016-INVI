import {Boundaries, Utils, Linear} from "./CarRenderer";
import {svg} from 'd3';
import d3 from 'd3';

const DEFAULT_MARGIN = Utils.margin(0, 0, 0, 0);

export type Axis = svg.Axis;

export const Once = (fn) => {
    let r;
    return (...args:any[]) => {
        if(!r) {
            r = fn.call(fn,args);
        }
        return r;
    }
}

export abstract class AbstractPlot {

    public plotWidth:number;
    public plotHeight:number;

    constructor(public width:number,
                public height:number,
                public margin:Boundaries = DEFAULT_MARGIN) {
        this.setSize(width, height, margin);
    }

    setSize(width:number, height:number, margin:Boundaries) {
        this.width = width;
        this.height = height;
        this.margin = margin;
        this.plotWidth = this.width - (this.margin.left + this.margin.right)
        this.plotHeight = this.height - (this.margin.top + this.margin.bottom)
    }

    abstract getXDomain():[number,number];

    abstract getYDomain():[number,number];

    private _xScale = Once(() => Utils.linearScaler(this.getXDomain(), [0, this.plotWidth]));
    get xScale():Linear {
        return this._xScale();
    }

    private _yScale = Once(() => Utils.linearScaler(this.getYDomain(), [0, this.plotHeight]));
    get yScale():Linear {
        return this._yScale();
    }

    private _xAxis = Once(() => d3.svg.axis().scale(this.xScale))
    get xAxis():Axis {
        return this._xAxis();
    }

    private _yAxis = Once(() => d3.svg.axis().scale(this.yScale))
    get yAxis():Axis {
        return this._yAxis();
    }
}