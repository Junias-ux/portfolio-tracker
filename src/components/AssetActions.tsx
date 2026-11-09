"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { TransactionModal } from "@/components/TransactionModal";
import { QuoteModal } from "@/components/QuoteModal";

export function AssetActions({ assetId }: { assetId: string }) {
  const [modal, setModal] = useState<"transaction" | "quote" | null>(null);

  return (
    <>
      <div className="flex gap-2">
        <Button variant="quiet" onClick={() => setModal("quote")}>
          Saisir un cours
        </Button>
        <Button variant="primary" onClick={() => setModal("transaction")}>
          + Nouvelle transaction
        </Button>
      </div>
      {modal === "transaction" && <TransactionModal assetId={assetId} onClose={() => setModal(null)} />}
      {modal === "quote" && <QuoteModal assetId={assetId} onClose={() => setModal(null)} />}
    </>
  );
}
