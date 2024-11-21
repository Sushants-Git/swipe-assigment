import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Invoice, TableHeaders } from "./TableHeaders";

export const InvoicesTable = ({ invoices }: { invoices: Invoice[] }) => {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableHeaders title="Invoices" />
                </TableHeader>
                <TableBody>
                    {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                            <TableCell>{invoice.serialNumber}</TableCell>
                            <TableCell>{invoice.customerName}</TableCell>
                            <TableCell>{invoice.productName}</TableCell>
                            <TableCell>
                                {Number(invoice?.qty)
                                    ? Number(invoice?.qty)?.toFixed(2)
                                    : invoice?.qty}
                            </TableCell>
                            <TableCell>
                                {Number(invoice?.tax)
                                    ? Number(invoice?.tax)?.toFixed(2)
                                    : invoice?.tax}
                            </TableCell>
                            <TableCell>
                                {Number(invoice?.totalAmount)
                                    ? Number(invoice?.totalAmount)?.toFixed(2)
                                    : invoice?.totalAmount}
                            </TableCell>
                            <TableCell>{invoice.date}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
