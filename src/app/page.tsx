"use client";

import React, { useCallback, useEffect, useState, ChangeEvent } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { QueryClient, QueryClientProvider, useMutation, useQueryClient } from "@tanstack/react-query";
import ExcelJS from "exceljs";
import { v4 as uuidv4 } from "uuid";

import { store, AppDispatch, RootState } from "./state/store";
import { changeHeader } from "./state/table/header-row-slice";
import { setAllData } from "./state/preview/preview-slice";

import { ModeToggle } from "@/components/mode-toggle";
import { FileUploader } from "./components/FileUploader";
import { TabNavigation } from "./components/TabNavigation";
import { DataPreview } from "./components/DataPreview";
import { Button } from "@/components/ui/button";

import isExcelFile from "./utils/utils/isExcelFile";
import getSheetDetails from "./utils/utils/getSheetDetails";
import getRandomRows from "./utils/utils/getRandomRows";
import fillInvoice from "./utils/utils/filledInvoice";
import fillCustomer from "./utils/utils/fillCustomer";
import transformInvoiceData from "./utils/utils/transformLogic";

type Mapping = {
    sourceColumnName: string;
    targetColumnName: string;
};

type DataMappings = {
    Invoices: Mapping[];
    Customers: Mapping[];
    Products: Mapping[];
};

export type Row = ExcelJS.CellValue[] | { [key: string]: ExcelJS.CellValue };

const queryClient = new QueryClient();

export default function ReactQueryWrapper() {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <App />
            </Provider>
        </QueryClientProvider>
    );
}

function App() {
    const [activeTab, setActiveTab] = useState<"invoices" | "products" | "customers">("invoices");
    const [file, setFile] = useState<File | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const header = useSelector((state: RootState) => state.header.headerRow);
    const extractedData = useSelector((state: RootState) => state.preview);
    const dispatch = useDispatch<AppDispatch>();
    const queryClient = useQueryClient();

    const extractExcel = useMutation({
        mutationFn: async ({
            headerRow,
            randomRows,
        }: {
            headerRow: Row | null;
            randomRows: ExcelJS.Row[];
        }) => {
            if (!file) return;

            const res = await fetch("/api/excel", {
                method: "POST",
                body: JSON.stringify({
                    headerRow,
                    randomRows: randomRows.map((row) => row.values satisfies Row),
                }),
            });

            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["excel_route"] }),
    });

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            extractExcel.reset();
        }
        setFile(selectedFile || null);
    };

    const extractData = async () => {
        if (!file || !isExcelFile(file)) return;

        setDialogOpen(true);

        const workbook = new ExcelJS.Workbook();
        const buffer = Buffer.from(await file.arrayBuffer());
        const wb = await workbook.xlsx.load(buffer);

        const { headerRow, headerRowNumber, gapAt } = getSheetDetails(wb);
        const randomRows = getRandomRows(wb, headerRowNumber + 1, gapAt, 3);

        dispatch(changeHeader(headerRow));
        extractExcel.mutate({ headerRow, randomRows });
    };

    const getSourceColumnIndex = useCallback(
        (sourceColumnName: string): number =>
            header ? (header as (string | null)[]).indexOf(sourceColumnName) : -1,
        [header],
    );

    useEffect(() => {
        if (!extractExcel?.data?.mapping) return;

        const invoiceMap = new Map<number, string>();
        const customerMap = new Map<number, string>();

        (extractExcel.data.mapping as DataMappings).Invoices.forEach((mapping) =>
            invoiceMap.set(getSourceColumnIndex(mapping.sourceColumnName), mapping.targetColumnName),
        );

        (extractExcel.data.mapping as DataMappings).Customers.forEach((mapping) =>
            customerMap.set(getSourceColumnIndex(mapping.sourceColumnName), mapping.targetColumnName),
        );

        const fillData = async () => {
            if (!file) return;

            const workbook = new ExcelJS.Workbook();
            const buffer = Buffer.from(await file.arrayBuffer());
            const wb = await workbook.xlsx.load(buffer);

            const { headerRowNumber, gapAt } = getSheetDetails(wb);
            const invoices = fillInvoice(wb, invoiceMap, headerRowNumber + 1, gapAt);
            const customers = fillCustomer(wb, customerMap, invoices, headerRowNumber + 1, gapAt);
            const { products } = transformInvoiceData(invoices);

            dispatch(setAllData({ uuid: uuidv4(), invoices, products, customers }));
        };

        fillData();
    }, [extractExcel?.data?.mapping, file, getSourceColumnIndex, dispatch]);

    return (
        <Layout>
            <FileUploader handleFileUpload={handleFileUpload} fileName={file?.name}>
                <DataPreview
                    dialogOpen={dialogOpen}
                    setDialogOpen={setDialogOpen}
                    tables={extractedData}
                    isLoading={extractExcel.isPending}
                >
                    <Button onClick={extractData} className="flex-shrink-0">
                        Extract Data
                    </Button>
                </DataPreview>
            </FileUploader>
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </Layout>
    );
}

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="container mx-auto p-4 flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)] relative">
            <ModeToggle />
            <h1 className="text-3xl font-bold mb-6">Invoice Management System</h1>
            {children}
        </div>
    );
}
