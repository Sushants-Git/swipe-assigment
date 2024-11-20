"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { FileUploader } from "./components/FileUploader";
import React from "react";
import { TabNavigation } from "./components/TabNavigation";

import { Provider } from "react-redux";
import { store } from "./state/store";

export default function App() {
    const [activeTab, setActiveTab] = React.useState<
        "invoices" | "products" | "customers"
    >("invoices");
    const [fileUploadStatus, setFileUploadStatus] = React.useState<
        "idle" | "success" | "error"
    >("idle");
    const [fileName, setFileName] = React.useState<string | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setTimeout(() => {
                setFileUploadStatus("success");
                setTimeout(() => setFileUploadStatus("idle"), 3000);
            }, 1000);
        } else {
            setFileUploadStatus("error");
            setFileName(null);
            setTimeout(() => setFileUploadStatus("idle"), 3000);
        }
    };

    return (
        <Provider store={store}>
            <Layout>
                <FileUploader
                    handleFileUpload={handleFileUpload}
                    fileName={fileName}
                    fileUploadStatus={fileUploadStatus}
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
