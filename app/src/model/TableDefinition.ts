export interface ColumnDefinition {
    title: string;
    field: string;
}

class ColumnDefinitionObject implements ColumnDefinition {
    constructor(public title:string, public field:string) {}
}

export interface ITableDefiniton {
    columns:ColumnDefinition[]
}

export const TableDefiniton:ITableDefiniton = {
    columns: [
        new ColumnDefinitionObject('Name','name'),
        new ColumnDefinitionObject('Miles per gallon','milesPerGallon'),
        new ColumnDefinitionObject('Cylinders','cylinders'),
        new ColumnDefinitionObject('Engine displacement','engineDisplacement'),
        new ColumnDefinitionObject('Horsepower','horsepower'),
        new ColumnDefinitionObject('Vehicle weight','weight'),
        new ColumnDefinitionObject('Acceleration','acceleration'),
        new ColumnDefinitionObject('Model year','modelYear'),
        new ColumnDefinitionObject('Origin','origin'),
    ]
}