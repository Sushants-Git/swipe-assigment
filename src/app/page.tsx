"use client";

import React, { useState, ChangeEvent } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { QueryClient, QueryClientProvider, useMutation, useQueryClient } from "@tanstack/react-query";
import ExcelJS from "exceljs";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

import { store, AppDispatch, RootState } from "./state/store";
import { setPreviewData } from "./state/preview/preview-slice";

import { ModeToggle } from "@/components/mode-toggle";
import { FileUploader } from "./components/FileUploader";
import { TabNavigation } from "./components/TabNavigation";
import { DataPreview } from "./components/DataPreview";
import { Button } from "@/components/ui/button";

import { isExcelFile, isImageFile, isPdfFile } from "./utils/isFile";
import getSheetDetails from "./utils/getSheetDetails";
import getRandomRows from "./utils/getRandomRows";

import processDataWithMapping from "./utils/initialFilling/processDataWithMapping";
import { tableState } from "./state/table/table-slice";
import areAllTablesEmpty from "./utils/areAllTablesEmpty";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type Mapping = {
    sourceColumnName: string;
    targetColumnName: string;
};

export type DataMappings = {
    Invoices: Mapping[];
    Customers: Mapping[];
    Products: Mapping[];
    isTaxInPercentage: boolean;
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

    const [showAlert, setShowAlert] = useState(false);

    const extractedData = useSelector((state: RootState) => state.preview);
    const dispatch = useDispatch<AppDispatch>();
    const queryClient = useQueryClient();

    const hashHeaderRow = (headerRow: Row | null): string => {
        const headerString = JSON.stringify(headerRow || []);
        return crypto.createHash("sha256").update(headerString).digest("hex");
    };

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

    const extractPdf = useMutation({
        mutationFn: async (type: "pdf" | "img") => {
            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", type);

            const res = await fetch("/api/pdf-and-img", {
                method: "POST",
                body: formData,
            });

            console.log(res);

            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pdf_route"] }),
    });

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            extractExcel.reset();
            extractPdf.reset();
            setShowAlert(false);
        }
        setFile(selectedFile || null);
    };

    const extractData = async () => {
        if (!file) return;

        if (isExcelFile(file)) {
            handleExcelFile();
        } else if (isPdfFile(file)) {
            handlePdfAndImageFile("pdf");
        } else if (isImageFile(file)) {
            handlePdfAndImageFile("img");
        }
    };

    const handlePdfAndImageFile = async (type: "pdf" | "img") => {
        setDialogOpen(true);
        extractPdf.mutate(type, {
            onSuccess: (data) => {
                if (data?.res as tableState) {
                    const { invoices, products, customers, isTaxInPercentage } = data.res as tableState;

                    if (areAllTablesEmpty({ invoices, products, customers })) {
                        setShowAlert(true);
                    }

                    dispatch(
                        setPreviewData({
                            uuid: uuidv4(),
                            invoices,
                            products,
                            customers,
                            isTaxInPercentage,
                        }),
                    );
                }
            },
        });
    };

    const handleExcelFile = async () => {
        if (!file) return;

        const workbook = new ExcelJS.Workbook();
        const buffer = Buffer.from(await file.arrayBuffer());
        const wb = await workbook.xlsx.load(buffer);

        const { headerRow, headerRowNumber, gapAt } = getSheetDetails(wb);
        const hash = hashHeaderRow(headerRow);

        const storedMapping = localStorage.getItem(hash);

        setDialogOpen(true);

        if (storedMapping) {
            console.log("Mapping found in localStorage.");
            const mapping = JSON.parse(storedMapping) as DataMappings;

            const { invoices, customers, products } = processDataWithMapping(
                headerRow,
                wb,
                mapping,
                headerRowNumber,
                gapAt,
            );

            dispatch(
                setPreviewData({
                    uuid: uuidv4(),
                    invoices,
                    products,
                    customers,
                    isTaxInPercentage: mapping.isTaxInPercentage,
                }),
            );
            return;
        }

        const randomRows = getRandomRows(wb, headerRowNumber + 1, gapAt, 3);

        extractExcel.mutate(
            { headerRow, randomRows },
            {
                onSuccess: (data) => {
                    if (data?.mapping) {
                        localStorage.setItem(hash, JSON.stringify(data.mapping));
                        const { invoices, customers, products } = processDataWithMapping(
                            headerRow,
                            wb,
                            data.mapping,
                            headerRowNumber,
                            gapAt,
                        );
                        dispatch(
                            setPreviewData({
                                uuid: uuidv4(),
                                invoices,
                                products,
                                customers,
                                isTaxInPercentage: data.mapping?.isTaxInPercentage,
                            }),
                        );
                    }
                },
            },
        );
    };

    return (
        <Layout>
            {showAlert && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Couldn&apos;t find any relavent details in the file</AlertTitle>
                    <AlertDescription>
                        Please upload an Excel, PDF, or image file that contains the required data
                    </AlertDescription>
                </Alert>
            )}
            <FileUploader handleFileUpload={handleFileUpload} fileName={file?.name}>
                <DataPreview
                    dialogOpen={dialogOpen}
                    setDialogOpen={setDialogOpen}
                    tables={extractedData}
                    isLoading={extractExcel.isPending || extractPdf.isPending}
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
