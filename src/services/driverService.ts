import { supabase } from '../lib/supabase';
import type { Tables, Inserts } from '../lib/supabase';

export interface DriverWithProcesses extends Tables<'users'> {
  truck_processes: (Tables<'truck_processes'> & {
    truck_stages: Tables<'truck_stages'>[];
    delivery_proofs?: Tables<'delivery_proofs'>[];
  })[];
}

export interface DeliveryProofData {
  photo: File;
  video?: File;
  notes?: string;
  location?: string;
}

export class DriverService {
  // Get current authenticated user
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  // Get driver profile with assigned truck
  static async getDriverProfile(userId: string): Promise<Tables<'users'> | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .eq('role', 'driver')
      .single();

    if (error) {
      console.error('Error fetching driver profile:', error);
      return null;
    }
    return data;
  }

  // Get driver's active dispatches with stages
  static async getDriverDispatches(driverId: string) {
    const { data, error } = await supabase
      .from('truck_processes')
      .select(`
        *,
        truck_stages (*),
        delivery_proofs (*)
      `)
      .eq('driver_id', driverId)
      .in('status', ['in_process', 'exception'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching driver dispatches:', error);
      throw error;
    }
    return data;
  }

  // Get completed dispatches for stats
  static async getCompletedDispatches(driverId: string, date?: string) {
    let query = supabase
      .from('truck_processes')
      .select('*')
      .eq('driver_id', driverId)
      .eq('status', 'delivered');

    if (date) {
      query = query.gte('actual_delivery_time', `${date}T00:00:00`);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching completed dispatches:', error);
      throw error;
    }
    return data;
  }

  // Update dispatch status
  static async updateDispatchStatus(
    dispatchId: string, 
    status: 'in_process' | 'delivered' | 'exception',
    currentStage?: 'gate' | 'loading' | 'weigh_in' | 'weigh_out' | 'departed' | 'delivered'
  ) {
    const updateData: any = { 
      status,
      updated_at: new Date().toISOString()
    };

    if (currentStage) {
      updateData.current_stage = currentStage;
    }

    if (status === 'delivered') {
      updateData.actual_delivery_time = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('truck_processes')
      .update(updateData)
      .eq('id', dispatchId)
      .select()
      .single();

    if (error) {
      console.error('Error updating dispatch status:', error);
      throw error;
    }
    return data;
  }

  // Upload delivery proof files
  static async uploadDeliveryProof(
    dispatchId: string, 
    proofData: DeliveryProofData
  ) {
    const timestamp = new Date().toISOString();
    const filePrefix = `delivery-proofs/${dispatchId}/${timestamp}`;

    try {
      // Upload photo
      const photoFileName = `${filePrefix}-photo.${proofData.photo.name.split('.').pop()}`;
      const { data: photoData, error: photoError } = await supabase.storage
        .from('mineflow-media')
        .upload(photoFileName, proofData.photo);

      if (photoError) throw photoError;

      // Upload video if provided
      let videoUrl: string | undefined;
      if (proofData.video) {
        const videoFileName = `${filePrefix}-video.${proofData.video.name.split('.').pop()}`;
        const { data: videoData, error: videoError } = await supabase.storage
          .from('mineflow-media')
          .upload(videoFileName, proofData.video);

        if (videoError) throw videoError;
        videoUrl = videoData.path;
      }

      // Get public URLs
      const { data: photoUrl } = supabase.storage
        .from('mineflow-media')
        .getPublicUrl(photoData.path);

      const { data: videoPublicUrl } = videoUrl ? supabase.storage
        .from('mineflow-media')
        .getPublicUrl(videoUrl) : { data: { publicUrl: undefined } };

      // Save delivery proof record
      const { data: proofRecord, error: proofError } = await supabase
        .from('delivery_proofs')
        .insert({
          truck_process_id: dispatchId,
          photo_url: photoUrl.publicUrl,
          video_url: videoPublicUrl?.publicUrl,
          timestamp,
          location: proofData.location,
          notes: proofData.notes
        })
        .select()
        .single();

      if (proofError) throw proofError;

      return proofRecord;
    } catch (error) {
      console.error('Error uploading delivery proof:', error);
      throw error;
    }
  }

  // Add truck stage
  static async addTruckStage(stageData: Inserts<'truck_stages'>) {
    const { data, error } = await supabase
      .from('truck_stages')
      .insert(stageData)
      .select()
      .single();

    if (error) {
      console.error('Error adding truck stage:', error);
      throw error;
    }
    return data;
  }

  // Get driver statistics
  static async getDriverStats(driverId: string) {
    const today = new Date().toISOString().split('T')[0];
    
    const [completedToday, totalCompleted, inProgress, exceptions] = await Promise.all([
      this.getCompletedDispatches(driverId, today),
      this.getCompletedDispatches(driverId),
      this.getDriverDispatches(driverId).then(dispatches => 
        dispatches.filter(d => d.status === 'in_process')
      ),
      this.getDriverDispatches(driverId).then(dispatches => 
        dispatches.filter(d => d.status === 'exception')
      )
    ]);

    return {
      completedToday: completedToday.length,
      totalCompleted: totalCompleted.length,
      inProgress: inProgress.length,
      exceptions: exceptions.length
    };
  }

  // Get current location (for delivery proof)
  static async getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          resolve(null);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }
}
