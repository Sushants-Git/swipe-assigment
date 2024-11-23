import { configureStore } from "@reduxjs/toolkit";
import tableReducer from "./table/table-slice";
import previewReducer from "./preview/preview-slice";
import taxReducer from "./tax/tax-slice";

export const store = configureStore({
    reducer: {
        tables: tableReducer,
        preview: previewReducer,
        tax: taxReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
