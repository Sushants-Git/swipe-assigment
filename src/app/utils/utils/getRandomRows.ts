import ExcelJS from "exceljs";

export default function getRandomRows(
    wb: ExcelJS.Workbook,
    start: number,
    end: number,
    howMany: number,
): ExcelJS.Row[] {
    const selectedRows: ExcelJS.Row[] = [];

    wb.eachSheet((sheet) => {
        let firstNonEmptyRowIndex = start;
        for (let i = start; i < end; i++) {
            const row = sheet.getRow(i);
            if (row.cellCount > 0) {
                firstNonEmptyRowIndex = i;
                selectedRows.push(row);
                break;
            }
        }

        const totalAvailableRows = end - firstNonEmptyRowIndex;
        const interval = Math.floor(totalAvailableRows / howMany);

        for (let i = 1; i < howMany; i++) {
            const rowIndex = firstNonEmptyRowIndex + interval * i;
            const row = sheet.getRow(rowIndex);
            if (row.cellCount > 0) {
                selectedRows.push(row);
            }
        }
    });

    return selectedRows;
}
