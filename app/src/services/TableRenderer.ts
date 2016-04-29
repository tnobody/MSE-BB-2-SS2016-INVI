import {TableDefiniton, ColumnDefinition} from '../model/TableDefinition';
import {Car} from '../model/Car'
import {Selection} from 'd3';
import {CarRenderer} from "./CarRenderer";

interface CellData {
    column:string;
    value:string;
}

export class TableRenderer implements CarRenderer{

    table:Selection<Car>;
    thead:Selection<Car>;
    tbody:Selection<Car>;
    headerRow:Selection<ColumnDefinition>;
    rows:Selection<Car>;
    cells:Selection<CellData>;
    
    constructor(private cars:Car[],private selection:Selection<Car>) {}

    public render() {
        this.table = this.selection.append('table');
        this.thead = this.table.append('thead');
        this.tbody = this.table.append('tbody');
        this.headerRow = this.thead.append('tr').selectAll('th')
            .data(TableDefiniton.columns)
            .enter()
            .append('th')
            .text(c => c.title);

        this.rows = this.tbody.selectAll('tr')
            .data(this.cars)
            .enter()
            .append('tr');

        this.cells = this.rows.selectAll('td')
            .data((row:Car) => TableDefiniton
                .columns
                .map(c => ({column: c.title, value: row[c.field]})))
            .enter()
            .append('td')
            .html(d => d.value)
    }
}