import { supabase } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";

export const B2BRepository = {
  // Org Settings (including new security columns)
  async getOrgStatus(orgId: string) {
    const { data, error } = await supabase
      .from('b2b_organizations')
      .select('*')
      .eq('id', orgId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateOrgSecurity(orgId: string, patch: Partial<Tables<'b2b_organizations'>>) {
    const { error } = await (supabase
      .from('b2b_organizations') as any)
      .update(patch)
      .eq('id', orgId);
    
    if (error) throw error;
  },

  // Employees / Members
  async getMembers(orgId: string) {
    const { data, error } = await supabase
      .from('b2b_members')
      .select('*')
      .eq('org_id', orgId)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async inviteMember(orgId: string, member: { name: string, email: string, role: string }) {
    const { error } = await (supabase
      .from('b2b_members') as any)
      .insert({
        org_id: orgId,
        name: member.name,
        email: member.email,
        role: member.role as any,
        status: 'active' as any // Alterado de 'invited' para seguir os Enums do types.ts
      });
    
    if (error) throw error;
  },

  // Campaigns & Analytics
  async getOrgByOwner(ownerId: string) {
    const { data, error } = await supabase
      .from('b2b_organizations')
      .select('*')
      .eq('owner_id', ownerId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async listCampaigns(orgId: string) {
    const { data, error } = await supabase
      .from('b2b_campaigns')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};
