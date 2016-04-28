import {Selection} from 'd3';

export interface CarRenderer {
    render(selection:Selection<any>)
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
    translate: (x:number,y:number) => `translate(${x}, ${y})`,
    rotate: (angle:number) => `rotate(${angle})`,
}