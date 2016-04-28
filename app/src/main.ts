import d3 from "d3";
import {CsvCar, Car} from "model/Car";
import {TableRenderer} from 'services/TableRenderer';
import {ScatterRenderer} from 'services/ScatterRenderer';

const ssv = d3.dsv(';', 'text/plain');

const OriginMap = {1:'USA', 2:'Europe', 3:'Japan'};

const convertToFloat = (s:string) => parseFloat(s.replace(',','.'));
const csvToCar = (csv:CsvCar):Car => ({
    acceleration: convertToFloat(csv['Acceleration']),
    cylinders: convertToFloat(csv['Cylinders']),
    engineDisplacement: convertToFloat(csv['Engine displacement']),
    horsepower: convertToFloat(csv['Horsepower']),
    milesPerGallon: convertToFloat(csv['Miles per gallon']),
    modelYear: convertToFloat(csv['Model year']) + 1900, // jap this is dirty ;)
    name: csv['Name'],
    origin: OriginMap[parseInt(csv['Origin'])],
    weight: convertToFloat(csv['Vehicle weight'])
} as Car);

ssv('resources/cars.csv', (data:CsvCar[]) => {
    const cars = data.map(csvToCar);

    const scatterRenderer = new ScatterRenderer(cars);
    scatterRenderer.render(d3.select('body'));

    const tableRenderer = new TableRenderer(cars);
    tableRenderer.render(d3.select('body'));
});