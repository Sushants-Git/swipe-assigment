import ExcelJS from "exceljs";
import { Customer, Invoice } from "@/app/components/TableHeaders";

export default function fillCustomer(
    wb: ExcelJS.Workbook,
    customerMap: Map<number, string>,
    invoices: Invoice[],
    start: number,
    gapAt: number,
): Customer[] {
    const customers: Customer[] = [];
    const customerAggregates = new Map<
        string,
        {
            totalPurchaseAmount: number;
            lastPurchaseDate: string;
            invoiceCount: number;
        }
    >();

    invoices.forEach((invoice) => {
        const customerName = invoice.customerName;
        if (!customerName) return;

        const totalAmount = parseFloat(invoice.totalAmount?.toString() || "0");
        const date = invoice.date || "";

        const existing = customerAggregates.get(customerName);
        if (existing) {
            existing.totalPurchaseAmount += totalAmount;
            existing.invoiceCount++;
            existing.lastPurchaseDate =
                !existing.lastPurchaseDate || date > existing.lastPurchaseDate
                    ? date
                    : existing.lastPurchaseDate;
        } else {
            customerAggregates.set(customerName, {
                totalPurchaseAmount: totalAmount,
                lastPurchaseDate: date,
                invoiceCount: 1,
            });
        }
    });

    wb.eachSheet((sheet) => {
        const customerNameIndex =
            Array.from(customerMap.entries()).find(([, targetName]) => targetName === "name")?.[0] ?? -1;
        sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            if (rowNumber > start && rowNumber < gapAt) {
                const customerName = (row.values as ExcelJS.CellValue[])[customerNameIndex] as string;

                if (!customerName) return;

                const existingCustomerIndex = customers.findIndex((c) => c.name === customerName);
                if (existingCustomerIndex === -1) {
                    const customerAggregate = customerAggregates.get(customerName);
                    const customer: Customer = {
                        id: customers.length + 1,
                        name: customerName,
                        totalPurchaseAmount: customerAggregate?.totalPurchaseAmount || 0,
                        lastPurchaseDate: customerAggregate?.lastPurchaseDate || "",
                    };

                    Array.from(customerMap as Map<number, keyof Customer>).forEach(
                        ([index, targetColumnName]) => {
                            if (
                                targetColumnName !== "name" &&
                                targetColumnName !== "totalPurchaseAmount" &&
                                targetColumnName !== "lastPurchaseDate"
                            ) {
                                const val = (row.values as ExcelJS.CellValue[])[index];
                                if ((val && typeof val === "string") || typeof val === "number") {
                                    //@ts-expect-error "val" can be "never" case is being ignored
                                    customer[targetColumnName] = val;
                                }
                            }
                        },
                    );

                    customers.push(customer);
                }
            }
        });
    });

    if (customers.length === 0) {
        customers.push({
            id: 1,
            name: "Unknown Customer",
            totalPurchaseAmount: 0,
        });
    }

    return customers;
}
