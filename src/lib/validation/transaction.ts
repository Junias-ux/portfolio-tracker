import { z } from "zod";

export const transactionTypeEnum = z.enum([
  "buy",
  "sell",
  "dividend",
  "deposit",
  "withdrawal",
  "fee",
]);

export const transactionInputSchema = z.object({
  assetId: z.string().uuid({ message: "assetId doit être un UUID valide." }),
  type: transactionTypeEnum,
  quantity: z
    .number({ invalid_type_error: "quantity doit être un nombre." })
    .positive({ message: "La quantité doit être strictement positive." }),
  unitPrice: z
    .number({ invalid_type_error: "unitPrice doit être un nombre." })
    .min(0, { message: "Le prix unitaire ne peut pas être négatif." }),
  transactionDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "transactionDate doit être une date valide (ISO 8601)." }),
  note: z.string().max(500).optional(),
});

export type TransactionInput = z.infer<typeof transactionInputSchema>;
