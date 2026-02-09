import { supabase } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";

export const B2BRepository = {
  async createOrg(input: { ownerId: string; name?: string; avatar?: string | null; primaryHue?: number | null }) {
    const { data, error } = await (supabase
      .from('b2b_organizations') as any)
      .insert({
        owner_id: input.ownerId,
        name: input.name || 'Minha Empresa',
        avatar: input.avatar ?? null,
        primary_hue: input.primaryHue ?? 145,
      })
      .select('*')
      .single();

    if (error) throw error;
    return data as any;
  },

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

  async ensureOrgForOwner(input: { ownerId: string; ownerEmail?: string | null; ownerName?: string | null }) {
    const existing = await B2BRepository.getOrgByOwner(input.ownerId);
    if (existing) return existing as any;

    // Create org
    const org = await B2BRepository.createOrg({ ownerId: input.ownerId });

    // Ensure owner is also a member (best-effort)
    try {
      if (input.ownerEmail) {
        await (supabase
          .from('b2b_members') as any)
          .insert({
            org_id: org.id,
            name: input.ownerName || 'Owner',
            email: input.ownerEmail,
            role: 'owner',
            status: 'active',
            user_id: input.ownerId,
          });
      }
    } catch (e) {
      // ignore if already exists / RLS blocks
    }

    return org as any;
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

  async inviteMember(orgId: string, member: { name: string, email: string, role: string, avatar?: string | null }) {
    const { error } = await (supabase
      .from('b2b_members') as any)
      .insert({
        org_id: orgId,
        name: member.name,
        email: member.email,
        role: member.role as any,
        status: 'invited' as any,
        avatar: member.avatar ?? null,
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

  async getCampaign(id: string) {
    const { data, error } = await supabase
      .from('b2b_campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
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
  ,

  async createCampaign(input: { orgId: string; title: string; themeId: string; duration: number; startDate?: string | null }) {
    const { data, error } = await (supabase
      .from('b2b_campaigns') as any)
      .insert({
        org_id: input.orgId,
        title: input.title,
        theme_id: input.themeId,
        duration: input.duration,
        start_date: input.startDate ?? null,
        status: 'draft',
      })
      .select('*')
      .single();

    if (error) throw error;
    return data as any;
  },

  async updateCampaign(id: string, patch: Partial<Tables<'b2b_campaigns'>>) {
    const { data, error } = await (supabase
      .from('b2b_campaigns') as any)
      .update(patch)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data as any;
  },

  async deleteCampaign(id: string) {
    const { error } = await supabase
      .from('b2b_campaigns')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
