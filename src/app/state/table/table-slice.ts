import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Customer } from "@/app/components/tabs/CustomersTable";
import { Invoice } from "@/app/components/tabs/InvoicesTable";
import { Product } from "@/app/components/tabs/ProductsTable";

interface tableState {
    invoices: Invoice[];
    products: Product[];
    customers: Customer[];
}

const initialState: tableState = {
    invoices: [
        {
            id: 1,
            serialNumber: "INV001",
            customerName: "John Doe",
            productName: "Widget A",
            qty: 5,
            tax: 10,
            totalAmount: 550,
            date: "2023-05-01",
            hasFile: true,
        },
        {
            id: 2,
            serialNumber: "INV002",
            customerName: "Jane Smith",
            productName: "Gadget B",
            qty: 2,
            tax: 5,
            totalAmount: 210,
            date: "2023-05-02",
            hasFile: false,
        },
    ],
    products: [
        {
            id: 1,
            name: "Widget A",
            quantity: 100,
            unitPrice: 100,
            tax: 10,
            priceWithTax: 110,
            discount: 5,
        },
        {
            id: 2,
            name: "Gadget B",
            quantity: 50,
            unitPrice: 200,
            tax: 20,
            priceWithTax: 220,
            discount: 10,
        },
    ],
    customers: [
        {
            id: 1,
            name: "John Doe",
            phoneNumber: "123-456-7890",
            totalPurchaseAmount: 1000,
            email: "john@example.com",
            lastPurchaseDate: "2023-04-15",
        },
        {
            id: 2,
            name: "Jane Smith",
            phoneNumber: "234-567-8901",
            totalPurchaseAmount: 750,
            email: "jane@example.com",
            lastPurchaseDate: "2023-04-20",
        },
    ],
};

const tableSlice = createSlice({
    name: "tabs",
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
