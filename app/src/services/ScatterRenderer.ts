import {CarRenderer, Utils} from 'services/CarRenderer';
import {Selection} from 'd3';
import d3 from 'd3';
import {Car} from '../model/Car';
import {BrushContainer} from "./BrushContainer";

const linearScaler = (domain:number[], range:number[]) => (d3.scale
    .linear()
    .domain(domain)
    .range(range))

const coordinates = (extendArr:[number, number]|[[number,number],[number,number]]) => ({
    p1: {x: extendArr[0][0], y: extendArr[0][1]},
    p2: {x: extendArr[1][0], y: extendArr[1][1]},
})

export class ScatterRenderer implements CarRenderer {

    private colorMap = {
        'USA': 'red',
        'Europe': 'green',
        'Japan': 'blue'
    }

    public plotWidth = 800;
    public plotHeight = 400;

    private xScale;
    private yScale;
    private rScale;

    private xAxis;
    private yAxis;

    private brush:BrushContainer;

    private circles:Selection<Car>;

    public plotMargin = Utils.margin(50, 50, 50, 50);

    private tooltip:Selection<Car>;

    private onSelectionListener:{(s:Selection<Car>):void}[] = [];

    get width() {
        return this.plotWidth + this.plotMargin.right + this.plotMargin.left
    }

    get height() {
        return this.plotHeight + this.plotMargin.bottom + this.plotMargin.top
    }

    constructor(private cars:Car[]) {
        this.xScale = linearScaler([
            d3.min(cars, c => c.acceleration || 0), d3.max(cars, c => c.acceleration || 0)
        ], [0, this.plotWidth]);
        this.yScale = linearScaler([
            d3.max(cars, c => c.milesPerGallon || 0), 0
        ], [0, this.plotHeight]);

        this.rScale = linearScaler([0, d3.max(cars, c => c.horsepower || 0)], [1, 10]);

        this.xAxis = d3.svg.axis()
            .scale(this.xScale)
            .tickSize(1, 5)
            .orient('bottom');

        this.yAxis = d3.svg.axis()
            .scale(this.yScale)
            .orient('left');

        this.tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        this.brush = new BrushContainer(this);
        this.brush.brush.on('brush', this.onBrush);
    }

    onSelection(l:(s:Selection<Car>)=>void) {
        this.onSelectionListener.push(l);
    }

    render(selection:Selection<any>) {
        const svg = selection.append('svg')
            .attr('class', 'scatterplot')
            .attr('width', this.width)
            .attr('height', this.height);

        svg.append('g')
            .attr('class', 'brush')
            .call(this.brush.brush);


        this.circles = svg.selectAll('circle')
            .data(this.cars)
            .enter()
            .append('circle')
            .attr('cx', (c:Car) => this.xScale(c.acceleration || 0) + this.plotMargin.left)
            .attr('cy', (c:Car) => this.yScale(c.milesPerGallon || 0) + this.plotMargin.top)
            .attr('r', (c:Car) => this.rScale(c.horsepower || 1))
            .attr('fill', (c:Car) => this.colorMap[c.origin])
            .style('cursor', 'pointer')
            .on('mouseover', this.onMouseoverCircle)
            .on('mouseleave', this.onMouseleaveCircle)

        svg.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', Utils.translate(
                this.plotMargin.left,
                this.plotMargin.top + this.plotHeight))
            .call(this.xAxis)
            .append('text')
            .style('text-anchor', 'end')
            .attr('x', `${this.plotWidth}px`)
            .attr('y', '-5')
            .text('Acceleration');

        svg.append('g')
            .attr('class', 'axis y-axis')
            .attr('transform', Utils.translate(
                this.plotMargin.left,
                this.plotMargin.top
            ))
            .call(this.yAxis)
            .append('text')
            .style('width', '150px')
            .style('text-anchor', 'end')
            .attr('x', '-150')
            .attr('y', '20')
            .attr('transform', Utils.rotate(-90))
            .text('Miles per gallon');

        const legend = svg.append('g')
            .selectAll('g')
            .data([
                {name: 'Europe', color: 'green'},
                {name: 'USA', color: 'red'},
                {name: 'Japan', color: 'blue'},
            ]).enter()
            .append('g');


        legend.append('text')
            .attr('x', this.width - this.plotMargin.right - 30)
            .attr('y', (d, i) => this.plotMargin.top + (i * 20))
            .text(d => d.name);

        legend.append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .attr('x', this.width - this.plotMargin.right - 45)
            .attr('y', (d, i) => this.plotMargin.top + (i * 20) - 10)
            .style('fill', d => d.color);

    }

    onBrush = (...args:any[]) => {
        const brushArea = coordinates(this.brush.brush.extent());
        this.circles.each(c => c.selected = false);
        const selection =this.circles.filter((c:Car) => {
                const x = this.xScale(c.acceleration || 0) + this.plotMargin.left;
                const y = this.yScale(c.milesPerGallon || 0) + this.plotMargin.top;
                return x >= brushArea.p1.x && y >= brushArea.p1.y && x <= brushArea.p2.x && y <= brushArea.p2.y;
            })
            .each(c => c.selected = true)
        this.circles.classed('brushed', c => c.selected);
        this.onSelectionListener.forEach(l => l(selection));
    }

    onMouseoverCircle = (c:Car) => {
        this.tooltip
            .style('display', 'block')
            .style('left', `${(d3.event as MouseEvent).pageX + 15}px`)
            .style('top', `${(d3.event as MouseEvent).pageY + 15}px`)
            .html(d => `
                <b>${c.name}</b><br />
                <div>Acceleration: ${c.acceleration}</div>
                <div>Cylinders: ${c.cylinders}</div>
                <div>Engine displacement: ${c.engineDisplacement}</div>
                <div>Horsepower: ${c.horsepower}</div>
                <div>Miles per gallon: ${c.milesPerGallon}</div>
                <div>Model Year: ${c.modelYear}</div>
                <div>Origin: ${c.origin}</div>
                <div>Vehicle weight: ${c.weight}</div>
            `)
            .transition()
            .duration(200)
            .style("opacity", 1)
    }

    onMouseleaveCircle = (c:Car) => {
        this.tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
            .each('end', c => this.tooltip.style('display', 'none'))
    }
}