import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Product, TableHeaders } from "../TableHeaders";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/state/store";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { Pencil } from "lucide-react";
import { editItemById } from "@/app/state/preview/preview-slice";
import React, { useEffect } from "react";
import isNumber from "@/app/utils/isNumber";

const EditIcon = () => (
    <Pencil className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
);

export const ProductsPreview = ({
    products,
    isTaxInPercentage,
}: {
    products: Product[];
    isTaxInPercentage?: boolean;
}) => {
    const dispatch = useDispatch<AppDispatch>();

    const [editingCell, setEditingCell] = React.useState<{
        id: number;
        key: string;
    } | null>(null);

    const [localProducts, setLocalProducts] = React.useState<Product[]>(products);

    useEffect(() => {
        setLocalProducts(products);
    }, [products]);

    const renderCell = (id: number, key: string, value?: string | number) => {
        const isEditing = editingCell?.id === id && editingCell?.key === key;
        const isEmpty = value === "" || value === null || value === undefined;

        const handleOnBlur = () => {
            dispatch(
                editItemById({
                    type: "product",
                    id,
                    updates: {
                        [key]: localProducts.find((pro) => pro.id === id)?.[key as keyof Product],
                    },
                }),
            );
            setEditingCell(null);
        };

        const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newLocalInvoices = localProducts.map((product) =>
                product.id === id ? { ...product, [key]: e.target.value } : product,
            );
            setLocalProducts(newLocalInvoices);
        };

        if (isEditing) {
            return (
                <Input
                    type="text"
                    value={value ?? ""}
                    onChange={handleOnChange}
                    onBlur={handleOnBlur}
                    autoFocus
                    className="w-full border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
            );
        }

        const formattedValue = isNumber(value) ? Number(value).toFixed(2) : (value ?? "");

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

    return (
        <Table>
            <TableHeader>
                <TableHeaders title="Products" isTaxInPercentage={isTaxInPercentage} />
            </TableHeader>
            <TableBody>
                {localProducts.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>{renderCell(product.id, "name", product.name)}</TableCell>
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
