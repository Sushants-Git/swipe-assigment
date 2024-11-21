import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Invoice, TableHeaders } from "../tabs/TableHeaders";
import React from "react";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/state/store";
import { editItemById } from "@/app/state/preview/preview-slice";
import { motion } from "motion/react";
import { Pencil } from "lucide-react";

export const InvoicesPreview = ({ invoices }: { invoices: Invoice[] }) => {
    const dispatch = useDispatch<AppDispatch>();

    const [editingCell, setEditingCell] = React.useState<{
        id: number;
        key: string;
    } | null>(null);

    const renderCell = (
        id: number,
        key: string,
        value?: string | number,
        isNumber?: boolean,
    ) => {
        const isEditing = editingCell?.id === id && editingCell?.key === key;
        const isEmpty = value === "" || value === null || value === undefined;

        if (isEditing) {
            return (
                <Input
                    type="text"
                    value={value ?? ""}
                    onChange={(e) => handleCellEdit(id, key, e.target.value)}
                    onBlur={() => setEditingCell(null)}
                    autoFocus
                    className="w-full border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
            );
        }

        return (
            <motion.div
                whileHover={{
                    scale: 1.02,
                }}
                transition={{ duration: 0.2 }}
                onClick={() => setEditingCell({ id: id, key })}
                className={`
                    border
                    border-gray-300
                    hover:border-foreground
                    group relative cursor-pointer 
                    hover:bg-foreground
                    hover:text-background
                    p-2 rounded 
                    ${isEmpty ? "text-gray-500" : ""}
                    flex items-center justify-between
                `}
            >
                <span className={isEmpty ? "italic" : ""}>
                    {isNumber
                        ? Number(value)
                            ? Number(value)?.toFixed(2)
                            : value
                        : (value ?? "")}
                </span>
                <Pencil
                    className="
                        w-4 h-4 
                        text-gray-400 
                        opacity-0 
                        group-hover:opacity-100 
                        transition-opacity 
                        duration-300
                    "
                />
            </motion.div>
        );
    };

    const handleCellEdit = (id: number, key: string, value: string) => {
        dispatch(
            editItemById({
                type: "invoice",
                id,
                updates: { [key]: value },
            }),
        );
    };

    return (
        <Table>
            <TableHeader>
                <TableHeaders title="Invoices" />
            </TableHeader>
            <TableBody>
                {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                        <TableCell>
                            {renderCell(
                                invoice.id,
                                "serialNumber",
                                invoice.serialNumber,
                            )}
                        </TableCell>
                        <TableCell>
                            {renderCell(
                                invoice.id,
                                "customerName",
                                invoice.customerName,
                            )}
                        </TableCell>
                        <TableCell>
                            {renderCell(
                                invoice.id,
                                "productName",
                                invoice.productName,
                            )}
                        </TableCell>
                        <TableCell>
                            {renderCell(invoice.id, "qty", invoice?.qty, true)}
                        </TableCell>
                        <TableCell>
                            {renderCell(invoice.id, "tax", invoice?.tax, true)}
                        </TableCell>
                        <TableCell>
                            {renderCell(
                                invoice.id,
                                "totalAmount",
                                invoice?.totalAmount,
                                true,
                            )}
                        </TableCell>
                        <TableCell>
                            {renderCell(invoice.id, "date", invoice.date)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
