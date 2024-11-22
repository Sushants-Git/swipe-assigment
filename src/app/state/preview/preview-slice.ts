import { Customer, Invoice, Product } from "@/app/components/tabs/TableHeaders";
import { customerFill } from "@/app/utils/edittingFilling/customerFill";
import fillProduct from "@/app/utils/initialFilling/fillProduct";
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
                        const updatedInvoices = state.invoices.map((invoice, index) =>
                            index === invoiceIndex ? { ...invoice, ...updates } : invoice,
                        );

                        state.customers = customerFill(state.customers, updatedInvoices);

                        state.products = fillProduct(updatedInvoices);

                        state.invoices[invoiceIndex] = {
                            ...state.invoices[invoiceIndex],
                            ...updates,
                        };
                    }
                    break;

                case "product":
                    const productIndex = state.products.findIndex((prod) => prod.id === id);
                    if (productIndex !== -1) {
                        if ((updates as Product).name) {
                            const updatedInvoice = state.invoices.map((invoice) => {
                                if (invoice.productName === state.products[productIndex].name) {
                                    return { ...invoice, productName: (updates as Product).name };
                                }
                                return invoice;
                            });

                            state.invoices = updatedInvoice;
                        }
                        state.products[productIndex] = {
                            ...state.products[productIndex],
                            ...updates,
                        };
                    }
                    break;

                case "customer":
                    const customerIndex = state.customers.findIndex((cust) => cust.id === id);
                    if (customerIndex !== -1) {
                        if ((updates as Customer).name) {
                            const updatedInvoice = state.invoices.map((invoice) => {
                                if (invoice.customerName === state.customers[customerIndex].name) {
                                    return { ...invoice, customerName: (updates as Customer).name };
                                }
                                return invoice;
                            });

                            state.invoices = updatedInvoice;
                        }
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
