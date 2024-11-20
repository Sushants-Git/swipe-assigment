import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";

export interface Customer {
    id: number;
    name: string;
    phoneNumber: string;
    totalPurchaseAmount: number;
    email: string;
    lastPurchaseDate: string; 
}

export const CustomersTable = ({ customers }: { customers: Customer[] }) => {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Total Purchase Amount</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Last Purchase Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.map((customer) => (
                        <TableRow key={customer.id}>
                            <TableCell>{customer.name}</TableCell>
                            <TableCell>{customer.phoneNumber}</TableCell>
                            <TableCell>
                                ${customer.totalPurchaseAmount.toFixed(2)}
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
