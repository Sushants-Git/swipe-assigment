import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Product, TableHeaders } from "../tabs/TableHeaders";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/state/store";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { Pencil } from "lucide-react";
import { editItemById } from "@/app/state/preview/preview-slice";
import React from "react";

const EditIcon = () => (
    <Pencil className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
);

export const ProductsPreview = ({ products }: { products: Product[] }) => {
    const dispatch = useDispatch<AppDispatch>();

    const [editingCell, setEditingCell] = React.useState<{
        id: number;
        key: string;
    } | null>(null);

    const renderCell = (id: number, key: string, value?: string | number) => {
        const isEditing = editingCell?.id === id && editingCell?.key === key;
        const isEmpty = value === "" || value === null || value === undefined;
        const isNumber = typeof value === "number";

        if (isEditing) {
            return (
                <Input
                    type="text"
                    value={value ?? ""}
                    onChange={(e) => handleCellEdit(id, key, e.target.value)}
                    onBlur={() => setEditingCell(null)}
                    autoFocus
                    className="w-full border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
            );
        }

        const formattedValue = isNumber ? Number(value).toFixed(2) : (value ?? "");

        return (
            <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => setEditingCell({ id, key })}
                className={`
          group relative cursor-pointer 
          p-2 rounded-md
          border border-border hover:border-primary
          hover:bg-primary hover:text-primary-foreground
          transition-colors duration-300
          flex items-center justify-between
          ${isEmpty ? "italic text-muted-foreground" : ""}
        `}
            >
                <span>{formattedValue}</span>
                <EditIcon />
            </motion.div>
        );
    };

    const handleCellEdit = (id: number, key: string, value: string) => {
        dispatch(
            editItemById({
                type: "product",
                id,
                updates: { [key]: value },
            }),
        );
    };

    return (
        <Table>
            <TableHeader>
                <TableHeaders title="Products" />
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>{renderCell(product.id, "name", product.name)}</TableCell>
                        <TableCell>
                            {Number(product?.quantity)
                                ? Number(product?.quantity)?.toFixed(2)
                                : product?.quantity}
                        </TableCell>
                        <TableCell>
                            {renderCell(product.id, "unitPrice", product.unitPrice, true)}
                        </TableCell>
                        <TableCell>
                            {Number(product?.tax) ? Number(product?.tax)?.toFixed(2) : product?.tax}
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
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
