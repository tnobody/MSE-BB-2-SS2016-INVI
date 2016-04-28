import {TableDefiniton} from '../model/TableDefinition';
import {Car} from '../model/Car'
import {Selection} from 'd3';
import {CarRenderer} from "./CarRenderer";


export class TableRenderer implements CarRenderer{

    constructor(private cars:Car[]) {}

    public render(selection:Selection<any>) {
        const table = selection.append('table');
        const thead = table.append('thead');
        const tbody = table.append('tbody');
        thead.append('tr').selectAll('th')
            .data(TableDefiniton.columns)
            .enter()
            .append('th')
            .text(c => c.title)

        const rows = tbody.selectAll('tr')
            .data(this.cars)
            .enter()
            .append('tr');

        const cells = rows.selectAll('td')
            .data((row:Car) => TableDefiniton
                .columns
                .map(c => ({column: c.title, value: row[c.field]})))
            .enter()
            .append('td')
            .html(d => d.value)
    }
}