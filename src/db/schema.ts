import {
    boolean,
    date,
    integer,
    numeric,
    pgTable,
    varchar,
    uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const customersTable = pgTable("customers", {
    uuid: uuid().notNull(),
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }),
    phoneNumber: varchar({ length: 15 }),
    totalPurchaseAmount: numeric(),
    email: varchar({ length: 255 }),
    lastPurchaseDate: date(),
});

export const productsTable = pgTable("products", {
    uuid: uuid().notNull(),
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }),
    quantity: integer(),
    unitPrice: numeric(),
    tax: numeric(),
    priceWithTax: numeric(),
    discount: numeric(),
});

export const invoicesTable = pgTable("invoices", {
    uuid: uuid().notNull(),
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    serialNumber: varchar({ length: 50 }),
    customerId: integer(),
    productId: integer(),
    qty: integer(),
    tax: numeric(),
    totalAmount: numeric(),
    date: date(),
    hasFile: boolean(),
});

export const customersRelations = relations(customersTable, ({ many }) => ({
    invoices: many(invoicesTable),
}));

export const productsRelations = relations(productsTable, ({ many }) => ({
    invoices: many(invoicesTable),
}));

export const invoicesRelations = relations(invoicesTable, ({ one }) => ({
    customer: one(customersTable, {
        fields: [invoicesTable.customerId],
        references: [customersTable.id],
    }),
    product: one(productsTable, {
        fields: [invoicesTable.productId],
        references: [productsTable.id],
    }),
}));
