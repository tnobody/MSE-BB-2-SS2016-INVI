import * as d3 from "d3";
import {CsvCar, Car} from "model/Car";
import {TableDefiniton} from 'model/TableDefinition';

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
    console.log(cars,data);
    const table = d3.select('body').append('table');
    const thead = table.append('thead');
    const tbody = table.append('tbody');
    thead.append('tr').selectAll('th')
        .data(TableDefiniton.columns)
        .enter()
        .append('th')
        .text(c => c.title)

    const rows = tbody.selectAll('tr')
        .data(cars)
        .enter()
        .append('tr');

    const cells = rows.selectAll('td')
        .data((row:Car) => TableDefiniton.columns.map(c => {
            return {column: c.title, value: row[c.field]};
        }))
        .enter()
        .append('td')
        .html(d => d.value)
});