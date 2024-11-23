import { TableHead, TableRow } from "@/components/ui/table";

export interface Customer {
    id: number;
    name?: string;
    phoneNumber?: string | number;
    totalPurchaseAmount?: string | number;
    email?: string;
    lastPurchaseDate?: string;
}

export interface Invoice {
    id: number;
    serialNumber?: string;
    customerName?: string;
    productName?: string;
    qty?: string | number;
    tax?: string | number;
    totalAmount?: string | number;
    date?: string;
}

export interface Product {
    id: number;
    name?: string;
    quantity?: string | number;
    unitPrice?: string | number;
    tax?: string | number;
    priceWithTax?: string | number;
    discount?: string | number;
}

export const TableHeaders = ({
    title,
    isTaxInPercentage,
}: {
    title: string;
    isTaxInPercentage?: boolean;
}) => {
    switch (title) {
        case "Invoices":
            return (
                <TableRow>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Tax ({`${isTaxInPercentage ? "%" : "₹"}`})</TableHead>
                    <TableHead>Total Amount (₹)</TableHead>
                    <TableHead>Date</TableHead>
                </TableRow>
            );
        case "Products":
            return (
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Tax ({`${isTaxInPercentage ? "%" : "₹"}`})</TableHead>
                    <TableHead>Price with Tax (₹)</TableHead>
                    <TableHead>Discount</TableHead>
                </TableRow>
            );
        case "Customers":
            return (
                <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Total Purchase Amount (₹)</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Last Purchase Date</TableHead>
                </TableRow>
            );
        default:
            return null;
    }
};
