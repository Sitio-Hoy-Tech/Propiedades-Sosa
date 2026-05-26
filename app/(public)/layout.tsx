import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import { getTenantConfig } from "@/lib/tenant";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const tenant = await getTenantConfig();
  const whatsapp = tenant.whatsapp ?? "";

  return (
    <>
      <Header whatsapp={whatsapp} />
      <main>{children}</main>
      <Footer whatsapp={whatsapp} />
      <WhatsAppFloat whatsapp={whatsapp} />
    </>
  );
}
