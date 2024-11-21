import { Invoice, Product } from "@/app/components/tabs/TableHeaders";

interface TransformationResult {
    products: Product[];
}

function transformInvoiceData(invoices: Invoice[]): TransformationResult {
    const productMap = new Map<string, Product>();

    invoices.forEach((invoice) => {
        const productName = invoice.productName || `Unknown Product`;

        if (!productMap.has(productName)) {
            const product: Product = {
                id: productMap.size + 1,
                name: productName,
                quantity: invoice.qty,
                unitPrice: invoice.totalAmount,
                tax: invoice.tax,
                priceWithTax: invoice.totalAmount,
                discount: 0,
            };
            productMap.set(productName, product);
        } else {
            const existingProduct = productMap.get(productName)!;
            existingProduct.quantity = (
                parseFloat(existingProduct.quantity?.toString() || "0") +
                parseFloat(invoice.qty?.toString() || "0")
            ).toString();
        }
    });

    return {
        products: Array.from(productMap.values()),
    };
}

export default transformInvoiceData;
