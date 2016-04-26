import * as d3 from "d3";

d3.csv('resources/cars.csv', (data) => {
    console.log(data);
})