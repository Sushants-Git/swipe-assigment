import { Row } from "@/app/page";
import ExcelJS from "exceljs";

export default function getSheetDetails(wb: ExcelJS.Workbook): {
    headerRow: Row | null;
    headerRowNumber: number;
    gapAt: number;
} {
    let headerRow: Row | null = null;
    let headerRowNumber = -1;
    let headerFound = false;

    let gapAt = -1;
    let foundGap = false;

    let val = null;
    let rightBehindVal: number | null = null;

    wb.eachSheet((sheet) => {
        sheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
            if (!headerFound) {
                headerRow = row.values;
                headerRowNumber = rowNumber;
                headerFound = true;
            }

            if (!foundGap) {
                val = rowNumber;

                if (val && rightBehindVal) {
                    if (val - rightBehindVal !== 1) {
                        gapAt = rightBehindVal + 1;
                        foundGap = true;
                    }
                }

                rightBehindVal = val;
            }
        });

        if (gapAt === -1) {
            gapAt = sheet.rowCount;
        }

        if (headerRowNumber === -1) {
            headerRowNumber = 1;
        }
    });

    return { headerRow, headerRowNumber, gapAt };
}
