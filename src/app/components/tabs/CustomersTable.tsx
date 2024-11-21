import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Customer, TableHeaders } from "./TableHeaders";

const formatNumber = (value?: string | number) => {
    const num = Number(value);
    return isNaN(num) ? value : num.toFixed(2);
};

const CustomersTableRow = ({ customer }: { customer: Customer }) => (
    <TableRow key={customer.id}>
        <TableCell>{customer.name}</TableCell>
        <TableCell>{customer.phoneNumber}</TableCell>
        <TableCell>{formatNumber(customer.totalPurchaseAmount)}</TableCell>
        <TableCell>{customer.email}</TableCell>
        <TableCell>{customer.lastPurchaseDate}</TableCell>
    </TableRow>
);

export const CustomersTable = ({ customers }: { customers: Customer[] }) => (
    <div className="overflow-x-auto">
        <Table>
            <TableHeader>
                <TableHeaders title="Customers" />
            </TableHeader>
            <TableBody>
                {customers.map((customer) => (
                    <CustomersTableRow key={customer.id} customer={customer} />
                ))}
            </TableBody>
        </Table>
    </div>
);
