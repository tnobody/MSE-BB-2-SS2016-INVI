import d3 from 'd3'
import {ScatterRenderer} from "./ScatterRenderer";
import Identity = d3.scale.Identity
import Brush = d3.svg.Brush;


export class BrushContainer {
    public x:Identity;
    public y:Identity;

    public brush:Brush<any>;

    constructor(private scatterRenderer:ScatterRenderer) {
        this.x = d3.scale
            .identity()
            .domain([
                this.scatterRenderer.plotMargin.left,
                this.scatterRenderer.plotMargin.left+this.scatterRenderer.plotWidth]);
        this.y = d3.scale
            .identity()
            .domain([
                this.scatterRenderer.plotMargin.top,
                this.scatterRenderer.plotMargin.top+this.scatterRenderer.plotHeight])

        this.brush = d3.svg.brush()
            .x(this.x)
            .y(this.y)
    }

    getBrush() {

    }
}