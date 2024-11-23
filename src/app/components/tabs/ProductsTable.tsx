import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Product, TableHeaders } from "./TableHeaders";

const formatNumber = (value?: string | number) => {
    const num = Number(value);
    return isNaN(num) ? value : num.toFixed(2);
};

const ProductsTableRow = ({ product }: { product: Product }) => (
    <TableRow key={product.id}>
        <TableCell>{product.name}</TableCell>
        <TableCell>{formatNumber(product.quantity)}</TableCell>
        <TableCell>{formatNumber(product.unitPrice)}</TableCell>
        <TableCell>{formatNumber(product.tax)}</TableCell>
        <TableCell>{formatNumber(product.priceWithTax)}</TableCell>
        <TableCell>{formatNumber(product.discount)}%</TableCell>
    </TableRow>
);

export const ProductsTable = ({
    products,
    isTaxInPercentage,
}: {
    products: Product[];
    isTaxInPercentage?: boolean;
}) => (
    <div className="overflow-x-auto">
        <Table>
            <TableHeader>
                <TableHeaders title="Products" isTaxInPercentage={isTaxInPercentage} />
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <ProductsTableRow key={product.id} product={product} />
                ))}
            </TableBody>
        </Table>
    </div>
);
