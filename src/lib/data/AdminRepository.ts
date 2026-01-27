import { supabase } from "../supabase/client";

export const AdminRepository = {
  // BI & Feedback
  async getTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, profiles(display_name), pricing_plans(name)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getFeedbacks() {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*, profiles(display_name)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateFeedbackStatus(id: string, status: string) {
    const { error } = await (supabase
      .from('feedbacks') as any)
      .update({ status })
      .eq('id', id);
    if (error) {
      console.error('AdminRepository: Erro ao atualizar status', error.message);
      throw error;
    }
  },

  async getContactRequests() {
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateContactStatus(id: string, status: string) {
    const { error } = await (supabase
      .from('contact_requests') as any)
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  },

  async deleteContactRequest(id: string) {
    const { error } = await supabase
      .from('contact_requests')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Coupons
  async getCoupons() {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createCoupon(data: any) {
    const { error } = await supabase.from('coupons').insert(data);
    if (error) throw error;
  },

  async updateCoupon(id: string, data: any) {
    const { error } = await (supabase
      .from('coupons') as any)
      .update(data)
      .eq('id', id);
    if (error) throw error;
  },

  async deleteCoupon(id: string) {
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Plans
  async getPlans() {
    const { data, error } = await supabase
      .from('pricing_plans')
      .select('*')
      .order('price_cents', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async updatePlan(id: string, data: any) {
    const { error } = await (supabase
      .from('pricing_plans') as any)
      .update(data)
      .eq('id', id);
    if (error) throw error;
  },

  // Users & Organizations
  async getUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async deleteUser(id: string) {
    // Note: This usually requires an edge function if deleting from auth.users
    // For now we delete from profiles (cascade or RLS permitting)
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async getB2BOrgs() {
    const { data, error } = await supabase
      .from('b2b_organizations')
      .select('*, b2b_members(count)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async deleteOrg(id: string) {
    const { error } = await supabase
      .from('b2b_organizations')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Logs
  async getAuditLogs() {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*, profiles:user_id(display_name)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // SEO & Technical
  async getSettings() {
     const { data, error } = await supabase
       .from('site_settings')
       .select('*')
       .single();
     if (error && error.code !== 'PGRST116') throw error;
     return data;
  },

  async updateSettings(data: any) {
     const { error } = await supabase
       .from('site_settings')
       .upsert({ id: 'global', ...data });
     if (error) throw error;
  },

  async getSystemHealth() {
    const { data, error } = await supabase.rpc('get_system_stats');
    if (error) {
      console.error('AdminRepository.getSystemHealth error:', error.message);
      throw error;
    }
    return data;
  }
};
