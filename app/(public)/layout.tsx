import Footer from "@/components/ui/Footer";
import PublicLayoutShell from "@/components/ui/PublicLayoutShell";
import { getTenantConfig } from "@/lib/tenant";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const tenant = await getTenantConfig();
  const whatsapp = tenant.whatsapp ?? "";

  return (
    <PublicLayoutShell whatsapp={whatsapp}>
      <main>{children}</main>
      <Footer whatsapp={whatsapp} />
    </PublicLayoutShell>
  );
}
