import { Customer, Invoice, Product } from "@/app/components/tabs/TableHeaders";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PreviewState {
    uuid?: string;
    invoices: Invoice[];
    products: Product[];
    customers: Customer[];
}

const initialState: PreviewState = {
    uuid: undefined,
    invoices: [],
    products: [],
    customers: [],
};

const previewSlice = createSlice({
    name: "preview",
    initialState,
    reducers: {
        setAllData: (
            state,
            action: PayloadAction<{
                invoices?: Invoice[];
                products?: Product[];
                customers?: Customer[];
                uuid?: string;
            }>,
        ) => {
            const { invoices, products, customers, uuid } = action.payload;

            if (uuid) {
                state.uuid = uuid;
            }

            if (invoices) {
                state.invoices = invoices.map((invoice, index) => ({
                    ...invoice,
                    id: invoice.id || index + 1,
                }));
            }

            if (products) {
                state.products = products.map((product, index) => ({
                    ...product,
                    id: product.id || index + 1,
                }));
            }

            if (customers) {
                state.customers = customers.map((customer, index) => ({
                    ...customer,
                    id: customer.id || index + 1,
                }));
            }
        },

        editItemById: (
            state,
            action: PayloadAction<{
                type: "invoice" | "product" | "customer";
                id: number;
                updates: Partial<Invoice | Product | Customer>;
            }>,
        ) => {
            const { type, id, updates } = action.payload;

            switch (type) {
                case "invoice":
                    const invoiceIndex = state.invoices.findIndex((inv) => inv.id === id);
                    if (invoiceIndex !== -1) {
                        state.invoices[invoiceIndex] = {
                            ...state.invoices[invoiceIndex],
                            ...updates,
                        };
                    }
                    break;

                case "product":
                    const productIndex = state.products.findIndex((prod) => prod.id === id);
                    if (productIndex !== -1) {
                        state.products[productIndex] = {
                            ...state.products[productIndex],
                            ...updates,
                        };
                    }
                    break;

                case "customer":
                    const customerIndex = state.customers.findIndex((cust) => cust.id === id);
                    if (customerIndex !== -1) {
                        state.customers[customerIndex] = {
                            ...state.customers[customerIndex],
                            ...updates,
                        };
                    }
                    break;
            }
        },

        resetState: () => initialState,
    },
});

export const { resetState, setAllData, editItemById } = previewSlice.actions;

export default previewSlice.reducer;
