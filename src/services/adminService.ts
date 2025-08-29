import { supabase } from '../lib/supabase';
import type { Tables, Inserts, Updates } from '../lib/supabase';

export class AdminService {
  // ===== USERS/DRIVERS CRUD =====
  
  static async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createUser(userData: Inserts<'users'>) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateUser(id: string, updates: Updates<'users'>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteUser(id: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  static async getDrivers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'driver')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  static async getAvailableDrivers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'driver')
      .is('truck_assigned', null)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  // ===== TRUCK PROCESSES/ORDERS CRUD =====
  
  static async getAllTruckProcesses() {
    const { data, error } = await supabase
      .from('truck_processes')
      .select(`
        *,
        users!truck_processes_driver_id_fkey (
          id,
          name,
          email,
          phone,
          truck_assigned
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getTruckProcessById(id: string) {
    const { data, error } = await supabase
      .from('truck_processes')
      .select(`
        *,
        users!truck_processes_driver_id_fkey (
          id,
          name,
          email,
          phone,
          truck_assigned
        ),
        truck_stages (*),
        delivery_proofs (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createTruckProcess(processData: Inserts<'truck_processes'>) {
    const { data, error } = await supabase
      .from('truck_processes')
      .insert(processData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateTruckProcess(id: string, updates: Updates<'truck_processes'>) {
    const { data, error } = await supabase
      .from('truck_processes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteTruckProcess(id: string) {
    const { error } = await supabase
      .from('truck_processes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  static async assignDriverToTruck(processId: string, driverId: string) {
    // First, unassign the driver from any other active processes
    await supabase
      .from('truck_processes')
      .update({ driver_id: null })
      .eq('driver_id', driverId)
      .eq('status', 'in_process');

    // Then assign to the new process
    const { data, error } = await supabase
      .from('truck_processes')
      .update({ driver_id: driverId })
      .eq('id', processId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async unassignDriverFromTruck(processId: string) {
    const { data, error } = await supabase
      .from('truck_processes')
      .update({ driver_id: null })
      .eq('id', processId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ===== TRUCK STAGES CRUD =====
  
  static async getTruckStages(processId: string) {
    const { data, error } = await supabase
      .from('truck_stages')
      .select('*')
      .eq('truck_process_id', processId)
      .order('timestamp', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  static async createTruckStage(stageData: Inserts<'truck_stages'>) {
    const { data, error } = await supabase
      .from('truck_stages')
      .insert(stageData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateTruckStage(id: string, updates: Updates<'truck_stages'>) {
    const { data, error } = await supabase
      .from('truck_stages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteTruckStage(id: string) {
    const { error } = await supabase
      .from('truck_stages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // ===== DELIVERY PROOFS CRUD =====
  
  static async getDeliveryProofs(processId: string) {
    const { data, error } = await supabase
      .from('delivery_proofs')
      .select('*')
      .eq('truck_process_id', processId)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async createDeliveryProof(proofData: Inserts<'delivery_proofs'>) {
    const { data, error } = await supabase
      .from('delivery_proofs')
      .insert(proofData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteDeliveryProof(id: string) {
    const { error } = await supabase
      .from('delivery_proofs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // ===== ANALYTICS & REPORTS =====
  
  static async getDashboardStats() {
    const { data: totalProcesses, error: processesError } = await supabase
      .from('truck_processes')
      .select('status', { count: 'exact' });

    const { data: totalDrivers, error: driversError } = await supabase
      .from('users')
      .select('role', { count: 'exact' })
      .eq('role', 'driver');

    const { data: activeProcesses, error: activeError } = await supabase
      .from('truck_processes')
      .select('*', { count: 'exact' })
      .eq('status', 'in_process');

    if (processesError || driversError || activeError) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return {
      totalProcesses: totalProcesses?.length || 0,
      totalDrivers: totalDrivers?.length || 0,
      activeProcesses: activeProcesses?.length || 0,
    };
  }

  static async getProcessesByStatus() {
    const { data, error } = await supabase
      .from('truck_processes')
      .select('status')
      .order('status');

    if (error) throw error;

    const statusCounts = data.reduce((acc, process) => {
      acc[process.status] = (acc[process.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return statusCounts;
  }

  static async getRecentActivity(limit = 10) {
    const { data, error } = await supabase
      .from('truck_processes')
      .select(`
        *,
        users!truck_processes_driver_id_fkey (
          name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  // ===== SEARCH & FILTER =====
  
  static async searchTruckProcesses(query: string) {
    const { data, error } = await supabase
      .from('truck_processes')
      .select(`
        *,
        users!truck_processes_driver_id_fkey (
          name,
          email
        )
      `)
      .or(`truck_no.ilike.%${query}%,dispatch_id.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async filterProcessesByStatus(status: string) {
    const { data, error } = await supabase
      .from('truck_processes')
      .select(`
        *,
        users!truck_processes_driver_id_fkey (
          name,
          email
        )
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async filterProcessesByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('truck_processes')
      .select(`
        *,
        users!truck_processes_driver_id_fkey (
          name,
          email
        )
      `)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}
