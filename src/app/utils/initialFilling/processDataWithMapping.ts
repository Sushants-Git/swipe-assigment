import { DataMappings, Row } from "@/app/page";

import ExcelJS from "exceljs";

import { Customer, Invoice, Product } from "../../components/TableHeaders";
import fillInvoice from "./filledInvoice";
import fillCustomer from "./fillCustomer";
import fillProduct from "./fillProduct";

export default function processDataWithMapping(
    headerRow: Row | null,
    workbook: ExcelJS.Workbook,
    mapping: DataMappings,
    headerRowNumber: number,
    gapAt: number,
): { invoices: Invoice[]; customers: Customer[]; products: Product[] } {
    const invoiceMap = new Map<number, string>();
    const customerMap = new Map<number, string>();

    mapping.Invoices.forEach((mapping) =>
        invoiceMap.set(
            (headerRow as (string | null)[]).indexOf(mapping.sourceColumnName),
            mapping.targetColumnName,
        ),
    );

    mapping.Customers.forEach((mapping) =>
        customerMap.set(
            (headerRow as (string | null)[]).indexOf(mapping.sourceColumnName),
            mapping.targetColumnName,
        ),
    );

    const invoices = fillInvoice(workbook, invoiceMap, headerRowNumber + 1, gapAt);
    const customers = fillCustomer(workbook, customerMap, invoices, headerRowNumber + 1, gapAt);
    const products = fillProduct(invoices);

    return { invoices, customers, products };
}
