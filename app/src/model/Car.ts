export interface Car {
    acceleration:number;
    cylinders:number;
    engineDisplacement:number;
    horsepower:number;
    milesPerGallon:number;
    modelYear:number;
    name:string;
    origin:string;
    weight:number;
}

export interface CsvCar {
    'Acceleration':string;
    'Cylinders':string;
    'Engine displacement':string;
    'Horsepower':string;
    'Miles per gallon':string;
    'Model Year':string;
    'Name':string;
    'Origin':string;
    'Vehicle weight':string;
}