import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Customer, TableHeaders } from "../tabs/TableHeaders";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/state/store";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { Pencil } from "lucide-react";
import { editItemById } from "@/app/state/preview/preview-slice";
import React from "react";

export const CustomersPreview = ({ customers }: { customers: Customer[] }) => {
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
                    ${isEmpty ? "bg-foreground text-gray-500" : ""}
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
                type: "customer",
                id,
                updates: { [key]: value },
            }),
        );
    };

    return (
        <Table>
            <TableHeader>
                <TableHeaders title="Customers" />
            </TableHeader>
            <TableBody>
                {customers.map((customer) => (
                    <TableRow key={customer.id}>
                        <TableCell>
                            {renderCell(customer.id, "name", customer.name)}
                        </TableCell>
                        <TableCell>
                            {renderCell(
                                customer.id,
                                "phoneNumber",
                                customer.phoneNumber,
                            )}
                        </TableCell>
                        <TableCell>
                            {Number(customer.totalPurchaseAmount)
                                ? Number(customer.totalPurchaseAmount).toFixed(
                                      2,
                                  )
                                : customer.totalPurchaseAmount}
                        </TableCell>
                        <TableCell>
                            {renderCell(customer.id, "email", customer.email)}
                        </TableCell>
                        <TableCell>
                            {renderCell(
                                customer.id,
                                "lastPurchaseDate",
                                customer.lastPurchaseDate,
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
