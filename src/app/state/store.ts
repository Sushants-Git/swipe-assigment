import { configureStore } from "@reduxjs/toolkit";
import tableReducer from "./table/table-slice";
import headerReducer from "./table/header-row-slice";
import previewReducer from "./preview/preview-slice";

export const store = configureStore({
    reducer: {
        tables: tableReducer,
        header: headerReducer,
        preview: previewReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
