import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, FileText, Package, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setData, tableState } from "../state/table/table-slice";
import { InvoicesPreview } from "./preview/InvoicesPreview";
import { CustomersPreview } from "./preview/CustomersPreview";
import { ProductsPreview } from "./preview/ProductsPreview";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../state/store";

export const DataPreview = ({
    children,
    dialogOpen,
    setDialogOpen,
    tables,
    isLoading,
}: {
    children: React.ReactNode;
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    tables: tableState | null;
    isLoading: boolean;
}) => {
    const [itemIndex, setItemIndex] = React.useState(0);

    const dispatch = useDispatch<AppDispatch>();

    const isTableEmpty = tables
        ? tables?.invoices?.length === 0 &&
          tables?.products?.length === 0 &&
          tables?.customers?.length === 0
        : true;

    if (isTableEmpty && isLoading === false) return children;

    const items = [
        { title: "Invoices", icon: FileText, data: tables?.invoices },
        { title: "Products", icon: Package, data: tables?.products },
        { title: "Customers", icon: User, data: tables?.customers },
    ];

    const renderTable = () => {
        switch (itemIndex) {
            case 0:
                return tables?.invoices && <InvoicesPreview invoices={tables?.invoices} />;
            case 1:
                return tables?.products && <ProductsPreview products={tables?.products} />;
            case 2:
                return tables?.customers && <CustomersPreview customers={tables?.customers} />;
            default:
                return tables?.invoices && <InvoicesPreview invoices={tables?.invoices} />;
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-6xl">
                <DialogHeader>
                    <DialogTitle>Extracted Data</DialogTitle>
                    <DialogDescription>Preview of the extracted data</DialogDescription>
                </DialogHeader>
                {isLoading ? (
                    <div className="flex justify-center items-center h-[400px]">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        <div className="relative">
                            <div className="relative overflow-x-auto">
                                <div className="max-h-[400px] overflow-y-auto">{renderTable()}</div>
                            </div>
                        </div>
                        <div className="flex justify-center mt-4">
                            {items.map((item, index) => (
                                <Button
                                    key={item.title}
                                    variant={index === itemIndex ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setItemIndex(index)}
                                    className="mx-1"
                                >
                                    <item.icon className="h-4 w-4 mr-2" />
                                    {item.title}
                                </Button>
                            ))}
                        </div>
                        <Button
                            className="mt-2 ml-auto w-max"
                            onClick={() => {
                                dispatch(
                                    setData({
                                        uuid: tables?.uuid,
                                        invoices: tables?.invoices,
                                        customers: tables?.customers,
                                        products: tables?.products,
                                    }),
                                );
                                setDialogOpen(false);
                            }}
                        >
                            Save
                        </Button>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};
