import { Customer, Invoice, Product } from "@/app/components/tabs/TableHeaders";
import { createSlice } from "@reduxjs/toolkit";

export interface tableState {
    uuid?: string;
    invoices: Invoice[];
    products: Product[];
    customers: Customer[];
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
        serialNumber: "RAY/23-24/286",
    },
    {
        id: 2,
        name: "iPHONE 16 Cover",
        quantity: 1,
        unitPrice: 4599.0,
        tax: 18,
        priceWithTax: 4599.0,
        discount: 0,
        serialNumber: "RAY/23-24/286",
    },
    {
        id: 3,
        name: "Beats PRO X",
        quantity: 1,
        unitPrice: 24999.0,
        tax: 18,
        priceWithTax: 24999.0,
        discount: 0,
        serialNumber: "RAY/23-24/286",
    },
    {
        id: 4,
        name: "SPEAKER",
        quantity: 1,
        unitPrice: 10000.0,
        tax: 0,
        priceWithTax: 10000.0,
        discount: 0,
        serialNumber: "RAY/23-24/285",
    },
    {
        id: 5,
        name: "12 MM PLAIN GLASS",
        quantity: 500,
        unitPrice: 0.07,
        tax: 0,
        priceWithTax: 37.08,
        discount: 0,
        serialNumber: "RAY/23-24/282",
    },
    {
        id: 6,
        name: "plain glass",
        quantity: 1,
        unitPrice: 0.0,
        tax: 18,
        priceWithTax: 0.0,
        discount: 0,
        serialNumber: "RAY/23-24/280",
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
    {
        uuid: "4b8aa280-c1e0-48b8-ac2b-8c6209457b07",
        invoices: invoices,
        products: products,
        customers: customers,
    },
];

const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {},
    // reducers: {
    //     increment: (state) => {
    //         state.value += 1;
    //     },
    //     decrement: (state) => {
    //         state.value -= 1;
    //     },
    //     increment_by_amount: (state, action: PayloadAction<number>) => {
    //         state.value += action.payload;
    //     },
    // },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(incrementAsync.pending, () => {
    //             console.log("incrementAsync.pending");
    //         })
    //         .addCase(incrementAsync.fulfilled, (state, action) => {
    //             console.log("incrementAsync.fulfilled");
    //             state.value += action.payload;
    //         });
    // },
});

// export const incrementAsync = createAsyncThunk(
//     "counter/incrementAsync",
//     async (amount: number) => {
//         await new Promise((res) => setTimeout(res, 1000));
//         return amount;
//     },
// );

// export const { increment, decrement, increment_by_amount } =
//     counterSlice.actions;

export const {} = tableSlice.actions;

export default tableSlice.reducer;
