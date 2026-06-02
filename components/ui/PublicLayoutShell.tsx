"use client";

import { useState } from "react";
import Header from "./Header";
import WhatsAppFloat from "./WhatsAppFloat";

export default function PublicLayoutShell({ whatsapp, children }: { whatsapp: string; children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Header whatsapp={whatsapp} onMenuOpenChange={setMenuOpen} />
      {children}
      <WhatsAppFloat whatsapp={whatsapp} menuOpen={menuOpen} />
    </>
  );
}
