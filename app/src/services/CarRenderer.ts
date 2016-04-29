import {Selection, scale} from 'd3';
import d3 from 'd3';

export type Linear = scale.Linear<any,any>;

export interface CarRenderer {
    render()
}

export interface Point {
    x:number;y:number;
}

export interface Boundaries {
    top:number;
    left:number;
    bottom:number;
    right:number;
}

export const Utils = {
    margin: (top:number,right:number,bottom:number,left:number):Boundaries => ({
        top:top,
        left:left,
        right:right,
        bottom:bottom
    }),
    point: (x:number,y:number):Point => ({x:x,y:y}),
    translate: (x:number,y:number) => `translate(${x}, ${y})`,
    rotate: (angle:number) => `rotate(${angle})`,
    linearScaler: (domain:number[], range:number[]):Linear => (d3.scale
        .linear()
        .domain(domain)
        .range(range)),
    coordinates: (extendArr:[number, number]|[[number,number],[number,number]]):{p1:Point,p2:Point} => ({
        p1: {x: extendArr[0][0], y: extendArr[0][1]},
        p2: {x: extendArr[1][0], y: extendArr[1][1]},
    })
}