import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Product, TableHeaders } from "./TableHeaders";

export const ProductsTable = ({ products }: { products: Product[] }) => {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableHeaders title="Products" />
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>
                                {Number(product?.quantity)
                                    ? Number(product?.quantity)?.toFixed(2)
                                    : product?.quantity}
                            </TableCell>
                            <TableCell>
                                {Number(product?.unitPrice)
                                    ? Number(product?.unitPrice)?.toFixed(2)
                                    : product?.unitPrice}
                            </TableCell>
                            <TableCell>
                                {Number(product?.tax)
                                    ? Number(product?.tax)?.toFixed(2)
                                    : product?.tax}
                            </TableCell>
                            <TableCell>
                                {Number(product?.priceWithTax)
                                    ? Number(product?.priceWithTax)?.toFixed(2)
                                    : product?.priceWithTax}
                            </TableCell>
                            <TableCell>
                                {Number(product?.discount)
                                    ? Number(product?.discount)?.toFixed(2)
                                    : product?.discount}
                                %
                            </TableCell>
                            <TableCell>{product.serialNumber}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
