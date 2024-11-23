import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Invoice, TableHeaders } from "../TableHeaders";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/state/store";
import { editItemById } from "@/app/state/preview/preview-slice";
import { motion } from "motion/react";
import { Pencil } from "lucide-react";

const EditIcon = () => (
    <Pencil className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
);

export const InvoicesPreview = ({
    invoices,
    isTaxInPercentage,
}: {
    invoices: Invoice[];
    isTaxInPercentage?: boolean;
}) => {
    const dispatch = useDispatch<AppDispatch>();

    const [editingCell, setEditingCell] = React.useState<{
        id: number;
        key: string;
    } | null>(null);
    const [localInvoices, setLocalInvoices] = React.useState<Invoice[]>(invoices);

    useEffect(() => {
        setLocalInvoices(invoices);
    }, [invoices]);

    const renderCell = (id: number, key: string, value?: string | number) => {
        const isEditing = editingCell?.id === id && editingCell?.key === key;
        const isEmpty = value === "" || value === null || value === undefined;
        const isNumber =
            typeof value === "number" || (!isNaN(Number(value)) && typeof value !== "boolean");

        const handleOnBlur = () => {
            dispatch(
                editItemById({
                    type: "invoice",
                    id,
                    updates: {
                        [key]: localInvoices.find((inv) => inv.id === id)?.[key as keyof Invoice],
                    },
                }),
            );
            setEditingCell(null);
        };

        const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newLocalInvoices = localInvoices.map((invoice) =>
                invoice.id === id ? { ...invoice, [key]: e.target.value } : invoice,
            );
            setLocalInvoices(newLocalInvoices);
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

    return (
        <Table>
            <TableHeader>
                <TableHeaders title="Invoices" isTaxInPercentage={isTaxInPercentage} />
            </TableHeader>
            <TableBody>
                {localInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                        <TableCell>
                            {renderCell(invoice.id, "serialNumber", invoice.serialNumber)}
                        </TableCell>
                        <TableCell>
                            {renderCell(invoice.id, "customerName", invoice.customerName)}
                        </TableCell>
                        <TableCell>
                            {renderCell(invoice.id, "productName", invoice.productName)}
                        </TableCell>
                        <TableCell>{renderCell(invoice.id, "qty", invoice?.qty)}</TableCell>
                        <TableCell>{renderCell(invoice.id, "tax", invoice?.tax)}</TableCell>
                        <TableCell>
                            {renderCell(invoice.id, "totalAmount", invoice?.totalAmount)}
                        </TableCell>
                        <TableCell>{renderCell(invoice.id, "date", invoice.date)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
