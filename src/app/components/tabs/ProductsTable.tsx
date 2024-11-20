import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";

export interface Product {
    id: number;
    name: string;
    quantity: number;
    unitPrice: number;
    tax: number;
    priceWithTax: number;
    discount: number;
    serialNumber: string;
}

export const ProductsTable = ({ products }: { products: Product[] }) => {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Tax (%)</TableHead>
                        <TableHead>Price with Tax</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Serial Number</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell>
                                {product.unitPrice.toFixed(2)}
                            </TableCell>
                            <TableCell>${product.tax.toFixed(2)}</TableCell>
                            <TableCell>
                                ₹{product.priceWithTax.toFixed(2)}
                            </TableCell>
                            <TableCell>{product.discount}%</TableCell>
                            <TableCell>{product.serialNumber}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
