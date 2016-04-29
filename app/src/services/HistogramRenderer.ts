import {Car} from "../model/Car";
import {Utils, CarRenderer} from "./CarRenderer";
import {Selection} from 'd3';
import d3 from 'd3';
import {AbstractPlot, Once} from "./AbstractPlot";

export class HistogramRenderer extends AbstractPlot implements CarRenderer{
    
    private carHistogram:{key:string,values:Car[]}[];
    private svg;
    private barGroup;
    private bar;
    private firstRendering = true;

    constructor(private cars:Car[],private selection:Selection<any>) {
        super(500,400, Utils.margin(50,50,50,50));
        this.updateHistogramData()

        this.yAxis
            .orient('left');


        this.xAxis
            .orient('bottom')
            .tickFormat(d3.format('d'));

        this.svg = this.selection
            .append('svg')
            .attr('class','histogram')
            .attr('width',this.width)
            .attr('height',this.height);

    }

    updateHistogramData(filter:(c:Car)=>boolean = (c) => true) {
        this.carHistogram = d3.nest()
            .key(c => `${(c as any).modelYear}`)
            .entries(this.cars)
            .map(e => ({
                key: e.key,
                values: e.values.filter(filter)
            }));
    }

    private _xScaleOrdinal = Once(() => d3.scale
        .ordinal()
        .domain(this.carHistogram.map(ch => ch.key))
        .rangeBands([0, this.plotWidth])
    );
    get xScale() {
        return this._xScaleOrdinal();
    }

    getYDomain() {
        return [
            d3.max(this.carHistogram, c => c.values.length),
            0
        ] as [number, number];
    }

    getXDomain() {
        return [
            d3.min(this.carHistogram, c => parseFloat(c.key)),
            d3.max(this.carHistogram, c => parseFloat(c.key))
        ] as [number, number];
    }

    private barRect;
    private barText;
    render() {
        this.barGroup = this.svg.selectAll('g.bar-group')
            .data(this.carHistogram);

        if(this.firstRendering) {
            this.bar = this.barGroup.enter().append('g')
                .attr('class','bar-group')
                .attr('transform', (d) => Utils.translate(this.xScale(d.key)+this.margin.left,0));

            this.barRect = this.bar.append('rect').attr('class','bar-rect')
            this.barText = this.bar.append('text').attr('class','bar-text')

            this.svg.append('g')
                .attr('class','x-axis axis')
                .attr('transform', Utils.translate(
                    this.margin.left,
                    this.margin.top + this.plotHeight))
                .call(this.xAxis);

            this.svg.append('g')
                .attr('class','y-axis axis')
                .attr('transform', Utils.translate(
                    this.margin.left,
                    this.margin.top))
                .call(this.yAxis);

            this.firstRendering = false;
        }

        this.barGroup.transition().select('.bar-rect').duration(100)
            .attr('y', d => this.margin.top + this.yScale(d.values.length))
            .attr('height', d => this.plotHeight - this.yScale(d.values.length))
            .attr('width', this.xScale.rangeBand());

        this.barGroup.transition().select('.bar-text').duration(100)
            .attr('x', this.xScale.rangeBand() /2)
            .attr('y', d => this.yScale(d.values.length) + this.margin.top-3)
            .attr('dx', d => `-0.5em`)
            .text(d => d.values.length);

        this.barGroup.exit().remove();
    }
}
