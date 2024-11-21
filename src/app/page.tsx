"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { FileUploader } from "./components/FileUploader";
import React, { useCallback, useEffect } from "react";
import { TabNavigation } from "./components/TabNavigation";

import { Provider, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, store } from "./state/store";
import isExcelFile from "./utils/utils/isExcelFile";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import ExcelJS from "exceljs";
import getRandomRows from "./utils/utils/getRandomRows";
import getSheetDetails from "./utils/utils/getSheetDetails";

import { changeHeader } from "./state/table/header-row-slice";
import { DataPreview } from "./components/DataPreview";
import { Button } from "@/components/ui/button";
import fillInvoice from "./utils/utils/filledInvoice";
import { setAllData } from "./state/preview/preview-slice";

import { v4 as uuidv4 } from "uuid";
import transformInvoiceData from "./utils/utils/transformLogic";
import fillCustomer from "./utils/utils/fillCustomer";

type Mapping = {
    sourceColumnName: string;
    targetColumnName: string;
};

type DataMappings = {
    Invoices: Mapping[];
    Customers: Mapping[];
    Products: Mapping[];
};

export type Row =
    | ExcelJS.CellValue[]
    | {
          [key: string]: ExcelJS.CellValue;
      };

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
    const [activeTab, setActiveTab] = React.useState<
        "invoices" | "products" | "customers"
    >("invoices");
    // const [fileUploadStatus, setFileUploadStatus] = React.useState<
    //     "idle" | "success" | "error"
    // >("idle");
    const [file, setFile] = React.useState<File | null>(null);

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const header = useSelector((state: RootState) => state.header.headerRow);
    const dispatch = useDispatch<AppDispatch>();

    const extractedData = useSelector((state: RootState) => state.preview);

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
                    randomRows: randomRows.map(
                        (row) => row.values satisfies Row,
                    ),
                }),
            });

            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["excel_route"] });
        },
    });

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file);
            // setFileUploadStatus("success");
            // setTimeout(() => setFileUploadStatus("idle"), 2000);
        } else {
            // setFileUploadStatus("error");
            setFile(null);
            // setTimeout(() => setFileUploadStatus("idle"), 2000);
        }
    };

    const extractData = async () => {
        if (!file) return;

        setDialogOpen(true);

        if (file && isExcelFile(file)) {
            const workbook = new ExcelJS.Workbook();
            const buffer = Buffer.from(await file.arrayBuffer());
            const wb = await workbook.xlsx.load(buffer);

            const { headerRow, headerRowNumber, gapAt } = getSheetDetails(wb);

            const randomRows = getRandomRows(wb, headerRowNumber + 1, gapAt, 3);

            dispatch(changeHeader(headerRow));

            extractExcel.mutate({ headerRow, randomRows });
        }
    };

    const getSourceColumIndex = useCallback(
        (sourceColumnName: string): number => {
            if (header) {
                return (header as (string | null)[]).indexOf(sourceColumnName);
            }

            return -1;
        },
        [header],
    );

    useEffect(() => {
        if (extractExcel?.data?.mapping) {
            const invoiceMap = new Map<number, string>();

            const customerMap = new Map<number, string>();

            (extractExcel.data.mapping as DataMappings).Invoices.forEach(
                (mapping) =>
                    invoiceMap.set(
                        getSourceColumIndex(mapping.sourceColumnName),
                        mapping.targetColumnName,
                    ),
            );

            (extractExcel.data.mapping as DataMappings).Customers.forEach(
                (mapping) =>
                    customerMap.set(
                        getSourceColumIndex(mapping.sourceColumnName),
                        mapping.targetColumnName,
                    ),
            );

            const filler = async () => {
                if (file) {
                    const workbook = new ExcelJS.Workbook();
                    const buffer = Buffer.from(await file.arrayBuffer());
                    const wb = await workbook.xlsx.load(buffer);

                    const { headerRowNumber, gapAt } = getSheetDetails(wb);

                    const invoices = fillInvoice(
                        wb,
                        invoiceMap,
                        headerRowNumber + 1,
                        gapAt,
                    );

                    const customers = fillCustomer(
                        wb,
                        customerMap,
                        invoices,
                        headerRowNumber + 1,
                        gapAt,
                    );

                    const { products } = transformInvoiceData(invoices);

                    dispatch(
                        setAllData({
                            uuid: uuidv4(),
                            invoices,
                            products: products,
                            customers: customers,
                        }),
                    );
                }
            };

            filler();
        }
    }, [extractExcel?.data?.mapping, file, getSourceColumIndex, dispatch]);

    return (
        <Layout>
            <FileUploader
                handleFileUpload={handleFileUpload}
                fileName={file?.name}
            >
                <DataPreview
                    dialogOpen={dialogOpen}
                    setDialogOpen={setDialogOpen}
                    tables={extractedData}
                    isLoading={extractExcel.isPending}
                >
                    <Button
                        type="submit"
                        className="flex-shrink-0"
                        onClick={extractData}
                    >
                        Extract Data
                    </Button>
                </DataPreview>
            </FileUploader>
            {
                // <pre>
                // {extractExcel?.data &&
                //     JSON.stringify(extractExcel.data.mapping, null, 2)}
                // </pre>
            }
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </Layout>
    );
}

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="container mx-auto p-4 flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)] relative">
            <ModeToggle />
            <h1 className="text-3xl font-bold mb-6">
                Invoice Management System
            </h1>
            {children}
        </div>
    );
}
