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
    const { error } = await supabase
      .from('b2b_organizations')
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
    const { error } = await supabase
      .from('b2b_members')
      .insert({
        org_id: orgId,
        name: member.name,
        email: member.email,
        role: member.role as any,
        status: 'invited' as any
      });
    
    if (error) throw error;
  }
};
