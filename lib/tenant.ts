import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { TAGS } from "@/lib/cache-tags";

export function getTenantId(): string {
  const id = process.env.NEXT_PUBLIC_TENANT_ID;
  if (!id) throw new Error("NEXT_PUBLIC_TENANT_ID no está definido");
  return id;
}

export interface TenantConfig {
  name: string;
  slug: string;
  url: string | null;
  whatsapp: string | null;
  contact_email: string | null;
  plan: string;
  status: string;
}

export const getTenantConfig = unstable_cache(
  async (): Promise<TenantConfig> => {
    const tenantId = getTenantId();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("tenants")
      .select("name, slug, url, whatsapp, contact_email, plan, status")
      .eq("id", tenantId)
      .single();

    if (error || !data) throw new Error("Tenant no encontrado");
    return data as TenantConfig;
  },
  ["tenant-config"],
  { tags: [TAGS.TENANT], revalidate: 3600 }
);
