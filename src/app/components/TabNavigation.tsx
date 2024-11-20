import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, Copy, FileText, Package, Users } from "lucide-react";
import { InvoicesTable } from "./tabs/InvoicesTable";
import { ProductsTable } from "./tabs/ProductsTable";
import { CustomersTable } from "./tabs/CustomersTable";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import React from "react";
import { Button } from "@/components/ui/button";

export const TabNavigation = ({
    activeTab,
    setActiveTab,
}: {
    activeTab: "invoices" | "products" | "customers";
    setActiveTab: (activeTab: "invoices" | "products" | "customers") => void;
}) => {
    const tables = useSelector((state: RootState) => state.tables);

    return (
        <Tabs
            value={activeTab}
            onValueChange={(value: string) => {
                if (
                    value === "invoices" ||
                    value === "products" ||
                    value === "customers"
                ) {
                    setActiveTab(value);
                }
            }}
            className="flex-grow flex flex-col"
        >
            <div className="flex-grow overflow-auto">
                <TabsContent value="invoices" className="mb-20">
                    <h2 className="text-2xl font-bold mb-4">Invoices</h2>
                    {tables.map((table, index) => (
                        <div
                            key={table.uuid}
                            style={{
                                marginTop: index === 0 ? "0px" : "60px",
                            }}
                        >
                            <TableHeader uuid={table.uuid} />
                            <InvoicesTable invoices={table.invoices} />
                        </div>
                    ))}
                </TabsContent>
                <TabsContent value="products" className="mb-20">
                    <h2 className="text-2xl font-bold mb-4">Products</h2>
                    {tables.map((table, index) => (
                        <div
                            key={table.uuid}
                            style={{
                                marginTop: index === 0 ? "0px" : "60px",
                            }}
                        >
                            <TableHeader uuid={table.uuid} />

                            <ProductsTable
                                products={table.products}
                                key={table.uuid}
                            />
                        </div>
                    ))}
                </TabsContent>
                <TabsContent value="customers" className="mb-20">
                    <h2 className="text-2xl font-bold mb-4">Customers</h2>
                    {tables.map((table, index) => (
                        <div
                            key={table.uuid}
                            style={{
                                marginTop: index === 0 ? "0px" : "60px",
                            }}
                        >
                            <TableHeader uuid={table.uuid} />

                            <CustomersTable
                                customers={table.customers}
                                key={table.uuid}
                            />
                        </div>
                    ))}
                </TabsContent>
            </div>
            <TabsList className="grid w-full grid-cols-3 fixed bottom-0 left-0 right-0 bg-background border-t border-border rounded-none">
                <TabsTrigger
                    value="invoices"
                    className="flex items-center gap-2"
                >
                    <FileText className="w-4 h-4" aria-hidden="true" />
                    <span>Invoices</span>
                </TabsTrigger>
                <TabsTrigger
                    value="products"
                    className="flex items-center gap-2"
                >
                    <Package className="w-4 h-4" aria-hidden="true" />
                    <span>Products</span>
                </TabsTrigger>
                <TabsTrigger
                    value="customers"
                    className="flex items-center gap-2"
                >
                    <Users className="w-4 h-4" aria-hidden="true" />
                    <span>Customers</span>
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
};

const TableHeader = ({ uuid }) => {
    const [copied, setCopied] = React.useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(uuid);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="flex items-center space-x-2 mb-6">
            <h3 className="text-lg font-medium text-muted-foreground">ID:</h3>
            <code className="text-lg font-medium text-foreground">
                {uuid.slice(0, 8)}..
            </code>
            <Button
                onClick={copyToClipboard}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title="Copy full ID"
            >
                {copied ? (
                    <Check className="h-4 w-4 text-muted-foreground" />
                ) : (
                    <Copy className="h-4 w-4 text-muted-foreground" />
                )}
            </Button>
        </div>
    );
};
