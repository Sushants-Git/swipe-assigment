import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Customer, TableHeaders } from "./TableHeaders";

export const CustomersTable = ({ customers }: { customers: Customer[] }) => {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableHeaders title="Customers" />
                </TableHeader>
                <TableBody>
                    {customers.map((customer) => (
                        <TableRow key={customer.id}>
                            <TableCell>{customer.name}</TableCell>
                            <TableCell>{customer.phoneNumber}</TableCell>
                            <TableCell>
                                {Number(customer.totalPurchaseAmount)
                                    ? Number(
                                          customer.totalPurchaseAmount,
                                      ).toFixed(2)
                                    : customer.totalPurchaseAmount}
                            </TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>{customer.lastPurchaseDate}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
