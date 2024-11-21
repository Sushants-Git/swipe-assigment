import { Row } from "@/app/page";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { headerRow: Row | null } = {
    headerRow: null,
};

const headerRowSlice = createSlice({
    name: "header-row",
    initialState,
    reducers: {
        changeHeader: (state, action: PayloadAction<Row | null>) => {
            state.headerRow = action.payload;
        },
    },
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

export const { changeHeader } = headerRowSlice.actions;

export default headerRowSlice.reducer;
