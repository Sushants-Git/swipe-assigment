"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { FileUploader } from "./components/FileUploader";
import React from "react";
import { TabNavigation } from "./components/TabNavigation";

import { Provider } from "react-redux";
import { store } from "./state/store";
import isExcelFile from "./utils/utils/isExcelFile";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function ReactQueryWrapper() {
    return (
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    );
}

function App() {
    const [activeTab, setActiveTab] = React.useState<
        "invoices" | "products" | "customers"
    >("invoices");
    const [fileUploadStatus, setFileUploadStatus] = React.useState<
        "idle" | "success" | "error"
    >("idle");
    const [file, setFile] = React.useState<File | null>(null);

    const queryClient = useQueryClient();

    const extractExcel = useMutation({
        mutationFn: async () => {
            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/excel", {
                method: "POST",
                body: formData,
            });

            console.log(await res.text());
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["excel_route"] });
        },
    });

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file);
            setFileUploadStatus("success");
            setTimeout(() => setFileUploadStatus("idle"), 2000);
        } else {
            setFileUploadStatus("error");
            setFile(null);
            setTimeout(() => setFileUploadStatus("idle"), 2000);
        }
    };

    const extractData = () => {
        if (!file) return;

        if (isExcelFile(file)) {
            extractExcel.mutate();
        }
    };

    return (
        <Provider store={store}>
            <Layout>
                <FileUploader
                    handleFileUpload={handleFileUpload}
                    fileName={file?.name}
                    fileUploadStatus={fileUploadStatus}
                    extractData={extractData}
                />
                <TabNavigation
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </Layout>
        </Provider>
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
