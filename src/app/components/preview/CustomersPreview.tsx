import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Customer, TableHeaders } from "../tabs/TableHeaders";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/state/store";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { Pencil } from "lucide-react";
import { editItemById } from "@/app/state/preview/preview-slice";
import React, { useEffect } from "react";

const EditIcon = () => (
    <Pencil className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
);

export const CustomersPreview = ({ customers }: { customers: Customer[] }) => {
    const dispatch = useDispatch<AppDispatch>();

    const [editingCell, setEditingCell] = React.useState<{
        id: number;
        key: string;
    } | null>(null);

    const [localCustomers, setLocalCustomers] = React.useState<Customer[]>(customers);

    useEffect(() => {
        setLocalCustomers(customers);
    }, [customers]);

    const renderCell = (
        id: number,
        key: string,
        value?: string | number,
        ignoreNumberCheck?: boolean,
    ) => {
        const isEditing = editingCell?.id === id && editingCell?.key === key;
        const isEmpty = value === "" || value === null || value === undefined;
        let isNumber =
            typeof value === "number" || (!isNaN(Number(value)) && typeof value !== "boolean");

        if (ignoreNumberCheck) {
            isNumber = false;
        }

        const handleOnBlur = () => {
            dispatch(
                editItemById({
                    type: "customer",
                    id,
                    updates: {
                        [key]: localCustomers.find((cust) => cust.id === id)?.[key as keyof Customer],
                    },
                }),
            );
            setEditingCell(null);
        };

        const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newLocalCustomers = localCustomers.map((customer) =>
                customer.id === id ? { ...customer, [key]: e.target.value } : customer,
            );
            setLocalCustomers(newLocalCustomers);
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
                <TableHeaders title="Customers" />
            </TableHeader>
            <TableBody>
                {localCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                        <TableCell>{renderCell(customer.id, "name", customer.name)}</TableCell>
                        <TableCell>
                            {renderCell(customer.id, "phoneNumber", customer.phoneNumber, true)}
                        </TableCell>
                        <TableCell>
                            {Number(customer.totalPurchaseAmount)
                                ? Number(customer.totalPurchaseAmount).toFixed(2)
                                : customer.totalPurchaseAmount}
                        </TableCell>
                        <TableCell>{renderCell(customer.id, "email", customer.email)}</TableCell>
                        <TableCell>{customer.lastPurchaseDate}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
