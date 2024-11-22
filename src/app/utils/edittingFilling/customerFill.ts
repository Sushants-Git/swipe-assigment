import { Customer, Invoice } from "@/app/components/tabs/TableHeaders";

export function customerFill(existingCustomers: Customer[], newInvoices: Invoice[]): Customer[] {
    const customerAggregates = new Map<
        string,
        {
            totalPurchaseAmount: number;
            lastPurchaseDate: string;
            invoiceCount: number;
        }
    >();

    newInvoices.forEach((invoice) => {
        const customerName = invoice.customerName;
        if (!customerName) return;

        const totalAmount = parseFloat(invoice.totalAmount?.toString() || "0");
        const date = invoice.date || "";

        const existing = customerAggregates.get(customerName);
        if (existing) {
            existing.totalPurchaseAmount += totalAmount;
            existing.invoiceCount++;
            existing.lastPurchaseDate =
                !existing.lastPurchaseDate || date > existing.lastPurchaseDate
                    ? date
                    : existing.lastPurchaseDate;
        } else {
            customerAggregates.set(customerName, {
                totalPurchaseAmount: totalAmount,
                lastPurchaseDate: date,
                invoiceCount: 1,
            });
        }
    });

    const updatedCustomers = existingCustomers.map((customer) => {
        const customerAggregate = customerAggregates.get(customer.name || "");

        return {
            ...customer,
            totalPurchaseAmount: customerAggregate
                ? customerAggregate.totalPurchaseAmount
                : customer.totalPurchaseAmount || 0,
            lastPurchaseDate: customerAggregate
                ? customerAggregate.lastPurchaseDate
                : customer.lastPurchaseDate || "",
        };
    });

    customerAggregates.forEach((aggregate, customerName) => {
        if (!updatedCustomers.some((c) => c.name === customerName)) {
            updatedCustomers.push({
                id: updatedCustomers.length + 1,
                name: customerName,
                totalPurchaseAmount: aggregate.totalPurchaseAmount,
                lastPurchaseDate: aggregate.lastPurchaseDate,
                phoneNumber: undefined,
                email: undefined,
            });
        }
    });

    if (updatedCustomers.length === 0) {
        updatedCustomers.push({
            id: 1,
            name: "Unknown Customer",
            totalPurchaseAmount: 0,
            lastPurchaseDate: "",
            phoneNumber: undefined,
            email: undefined,
        });
    }

    return updatedCustomers;
}
