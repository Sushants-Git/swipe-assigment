import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { File } from "lucide-react";

export interface Invoice {
    id: number;
    serialNumber: string;
    customerName: string;
    productName: string;
    qty: number;
    tax: number;
    totalAmount: number;
    date: string;
    hasFile: boolean;
}

export const InvoicesTable = ({ invoices }: { invoices: Invoice[] }) => {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Serial Number</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Tax</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Invoice File</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                            <TableCell>{invoice.serialNumber}</TableCell>
                            <TableCell>{invoice.customerName}</TableCell>
                            <TableCell>{invoice.productName}</TableCell>
                            <TableCell>{invoice.qty}</TableCell>
                            <TableCell>${invoice.tax.toFixed(2)}</TableCell>
                            <TableCell>
                                ${invoice.totalAmount.toFixed(2)}
                            </TableCell>
                            <TableCell>{invoice.date}</TableCell>
                            <TableCell>
                                {invoice.hasFile ? (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            alert(
                                                `Viewing file for invoice ${invoice.serialNumber}`,
                                            )
                                        }
                                    >
                                        <File className="h-4 w-4" />
                                        <span className="sr-only">
                                            View file for invoice{" "}
                                            {invoice.serialNumber}
                                        </span>
                                    </Button>
                                ) : (
                                    <span className="text-muted-foreground">
                                        No file
                                    </span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
