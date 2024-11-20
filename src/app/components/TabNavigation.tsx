import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, Package, Users } from "lucide-react";
import { InvoicesTable } from "./tabs/InvoicesTable";
import { ProductsTable } from "./tabs/ProductsTable";
import { CustomersTable } from "./tabs/CustomersTable";
import { Invoice } from "./tabs/InvoicesTable";
import { Product } from "./tabs/ProductsTable";
import { Customer } from "./tabs/CustomersTable";

export const TabNavigation = ({
    activeTab,
    setActiveTab,
    invoices,
    products,
    customers,
}: {
    activeTab: "invoices" | "products" | "customers";
    setActiveTab: (activeTab: "invoices" | "products" | "customers") => void;
    invoices: Invoice[];
    products: Product[];
    customers: Customer[];
}) => {
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
                <TabsContent value="invoices">
                    <h2 className="text-2xl font-bold mb-4">Invoices</h2>
                    <InvoicesTable invoices={invoices} />
                </TabsContent>
                <TabsContent value="products">
                    <h2 className="text-2xl font-bold mb-4">Products</h2>
                    <ProductsTable products={products} />
                </TabsContent>
                <TabsContent value="customers">
                    <h2 className="text-2xl font-bold mb-4">Customers</h2>
                    <CustomersTable customers={customers} />
                </TabsContent>
            </div>
            <TabsList className="grid w-full grid-cols-3 mt-4">
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
