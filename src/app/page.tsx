"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { FileUploader } from "./components/FileUploader";
import React from "react";
import { TabNavigation } from "./components/TabNavigation";

export default function App() {
    const [activeTab, setActiveTab] = React.useState<
        "invoices" | "products" | "customers"
    >("invoices");
    const [fileUploadStatus, setFileUploadStatus] = React.useState<
        "idle" | "success" | "error"
    >("idle");
    const [fileName, setFileName] = React.useState<string | null>(null);

    const invoices = [
        {
            id: 1,
            serialNumber: "INV001",
            customerName: "John Doe",
            productName: "Widget A",
            qty: 5,
            tax: 10,
            totalAmount: 550,
            date: "2023-05-01",
            hasFile: true,
        },
        {
            id: 2,
            serialNumber: "INV002",
            customerName: "Jane Smith",
            productName: "Gadget B",
            qty: 2,
            tax: 5,
            totalAmount: 210,
            date: "2023-05-02",
            hasFile: false,
        },
        {
            id: 3,
            serialNumber: "INV003",
            customerName: "Bob Johnson",
            productName: "Tool C",
            qty: 1,
            tax: 2,
            totalAmount: 102,
            date: "2023-05-03",
            hasFile: true,
        },
    ];

    const products = [
        {
            id: 1,
            name: "Widget A",
            quantity: 100,
            unitPrice: 100,
            tax: 10,
            priceWithTax: 110,
            discount: 5,
        },
        {
            id: 2,
            name: "Gadget B",
            quantity: 50,
            unitPrice: 200,
            tax: 20,
            priceWithTax: 220,
            discount: 10,
        },
        {
            id: 3,
            name: "Tool C",
            quantity: 200,
            unitPrice: 50,
            tax: 5,
            priceWithTax: 55,
            discount: 2,
        },
    ];

    const customers = [
        {
            id: 1,
            name: "John Doe",
            phoneNumber: "123-456-7890",
            totalPurchaseAmount: 1000,
            email: "john@example.com",
            lastPurchaseDate: "2023-04-15",
        },
        {
            id: 2,
            name: "Jane Smith",
            phoneNumber: "234-567-8901",
            totalPurchaseAmount: 750,
            email: "jane@example.com",
            lastPurchaseDate: "2023-04-20",
        },
        {
            id: 3,
            name: "Bob Johnson",
            phoneNumber: "345-678-9012",
            totalPurchaseAmount: 500,
            email: "bob@example.com",
            lastPurchaseDate: "2023-04-25",
        },
    ];

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
        <Layout>
            <FileUploader
                handleFileUpload={handleFileUpload}
                fileName={fileName}
                fileUploadStatus={fileUploadStatus}
            />
            <TabNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                invoices={invoices}
                products={products}
                customers={customers}
            />
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
