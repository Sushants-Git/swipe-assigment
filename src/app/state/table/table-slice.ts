import { Customer, Invoice, Product } from "@/app/components/TableHeaders";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface tableState {
    uuid?: string;
    invoices?: Invoice[];
    products?: Product[];
    customers?: Customer[];
    isTaxInPercentage?: boolean;
}

const products: Product[] = [
    {
        id: 1,
        name: "iPHONE 16",
        quantity: 1,
        unitPrice: 79990.0,
        tax: 18,
        priceWithTax: 79990.0,
        discount: 0,
    },
    {
        id: 2,
        name: "iPHONE 16 Cover",
        quantity: 1,
        unitPrice: 4599.0,
        tax: 18,
        priceWithTax: 4599.0,
        discount: 0,
    },
    {
        id: 3,
        name: "Beats PRO X",
        quantity: 1,
        unitPrice: 24999.0,
        tax: 18,
        priceWithTax: 24999.0,
        discount: 0,
    },
    {
        id: 4,
        name: "SPEAKER",
        quantity: 1,
        unitPrice: 10000.0,
        tax: 0,
        priceWithTax: 10000.0,
        discount: 0,
    },
    {
        id: 5,
        name: "12 MM PLAIN GLASS",
        quantity: 500,
        unitPrice: 0.07,
        tax: 0,
        priceWithTax: 37.08,
        discount: 0,
    },
    {
        id: 6,
        name: "plain glass",
        quantity: 1,
        unitPrice: 0.0,
        tax: 18,
        priceWithTax: 0.0,
        discount: 0,
    },
];

const invoices: Invoice[] = [
    {
        id: 1,
        serialNumber: "RAY/23-24/286",
        customerName: "Shounak",
        productName: "iPHONE 16",
        qty: 1,
        tax: 18,
        totalAmount: 79990.0,
        date: "12 Nov 2024",
    },
    {
        id: 2,
        serialNumber: "RAY/23-24/286",
        customerName: "Shounak",
        productName: "iPHONE 16 Cover",
        qty: 1,
        tax: 18,
        totalAmount: 4599.0,
        date: "12 Nov 2024",
    },
    {
        id: 3,
        serialNumber: "RAY/23-24/286",
        customerName: "Shounak",
        productName: "Beats PRO X",
        qty: 1,
        tax: 18,
        totalAmount: 24999.0,
        date: "12 Nov 2024",
    },
    {
        id: 4,
        serialNumber: "RAY/23-24/285",
        customerName: "Abhinav",
        productName: "SPEAKER",
        qty: 1,
        tax: 0,
        totalAmount: 10000.0,
        date: "12 Nov 2024",
    },
    {
        id: 5,
        serialNumber: "RAY/23-24/282",
        customerName: "RAM",
        productName: "12 MM PLAIN GLASS",
        qty: 500,
        tax: 0,
        totalAmount: 37.08,
        date: "07 Nov 2024",
    },
    {
        id: 6,
        serialNumber: "RAY/23-24/280",
        customerName: "Ramesh",
        productName: "plain glass",
        qty: 1,
        tax: 18,
        totalAmount: 0.0,
        date: "06 Nov 2024",
    },
];

const customers: Customer[] = [
    {
        id: 1,
        name: "Shounak",
        phoneNumber: 999999999,
        totalPurchaseAmount: 109588.67,
        email: "",
        lastPurchaseDate: "12 Nov 2024",
    },
    {
        id: 2,
        name: "Abhinav",
        phoneNumber: 888888888,
        totalPurchaseAmount: 30495.0,
        email: "",
        lastPurchaseDate: "12 Nov 2024",
    },
    {
        id: 3,
        name: "Ramesh",
        phoneNumber: 777777777,
        totalPurchaseAmount: 282.96,
        email: "",
        lastPurchaseDate: "08 Nov 2024",
    },
    {
        id: 4,
        name: "RAM",
        phoneNumber: 999999999,
        totalPurchaseAmount: 126.06,
        email: "",
        lastPurchaseDate: "07 Nov 2024",
    },
    {
        id: 5,
        name: "geeetha",
        phoneNumber: 666666666,
        totalPurchaseAmount: 55708.0,
        email: "",
        lastPurchaseDate: "01 Nov 2024",
    },
];

const initialState: tableState[] = [
    {
        uuid: "a5d80fba-0989-438a-840b-baefc30ea17f",
        invoices: invoices,
        products: products,
        customers: customers,
    },
];

const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {
        setTableData: (state, action: PayloadAction<tableState>) => {
            const { invoices, products, customers, uuid, isTaxInPercentage } = action.payload;

            return [{ uuid, products, customers, invoices, isTaxInPercentage }, ...state];
        },
    },
});

export const { setTableData } = tableSlice.actions;

export default tableSlice.reducer;
