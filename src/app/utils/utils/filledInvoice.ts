import { Invoice } from "@/app/components/tabs/TableHeaders";
import ExcelJS from "exceljs";

export default function fillInvoice(
    wb: ExcelJS.Workbook,
    invoiceMap: Map<number, string>,
    start: number,
    gapAt: number,
): Invoice[] {
    const invoices: Invoice[] = [];

    wb.eachSheet((sheet) => {
        sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            const invoice = {
                id: rowNumber,
            };

            if (rowNumber > start && rowNumber < gapAt) {
                Array.from(invoiceMap as Map<number, keyof Invoice>).map(([index, targetColumnName]) => {
                    //@ts-expect-error we are dynamically adding objects ts dosn't like that
                    invoice[targetColumnName] = (row.values as ExcelJS.CellValue[])[index];
                });

                invoices.push(invoice as Invoice);
            }
        });
    });

    return invoices;
}
