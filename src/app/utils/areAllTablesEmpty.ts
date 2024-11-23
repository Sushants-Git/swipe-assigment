import { Customer, Invoice, Product } from "../components/TableHeaders";

const areAllTablesEmpty = (tables: {
    invoices?: Invoice[];
    products?: Product[];
    customers?: Customer[];
}): boolean => {
    return Object.values(tables).every((table) => table === undefined || table.length === 0);
};

export default areAllTablesEmpty;
