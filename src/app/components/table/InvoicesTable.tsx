import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Invoice, TableHeaders } from "../TableHeaders";

const formatNumber = (value?: string | number) => {
    const num = Number(value);
    return isNaN(num) ? value : num.toFixed(2);
};

const InvoicesTableRow = ({ invoice }: { invoice: Invoice }) => (
    <TableRow key={invoice.id}>
        <TableCell>{invoice.serialNumber}</TableCell>
        <TableCell>{invoice.customerName}</TableCell>
        <TableCell>{invoice.productName}</TableCell>
        <TableCell>{formatNumber(invoice.qty)}</TableCell>
        <TableCell>{formatNumber(invoice.tax)}</TableCell>
        <TableCell>{formatNumber(invoice.totalAmount)}</TableCell>
        <TableCell>{invoice.date}</TableCell>
    </TableRow>
);

export const InvoicesTable = ({
    invoices,
    isTaxInPercentage,
}: {
    invoices: Invoice[];
    isTaxInPercentage?: boolean;
}) => (
    <div className="overflow-x-auto">
        <Table>
            <TableHeader>
                <TableHeaders title="Invoices" isTaxInPercentage={isTaxInPercentage} />
            </TableHeader>
            <TableBody>
                {invoices.map((invoice) => (
                    <InvoicesTableRow key={invoice.id} invoice={invoice} />
                ))}
            </TableBody>
        </Table>
    </div>
);
