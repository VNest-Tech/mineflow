import { supabase, TABLES } from '../lib/supabase'
import type { 
  Truck, 
  Order, 
  Dispatch, 
  Material, 
  Category, 
  Exception, 
  TruckProcess, 
  User,
  TruckStage 
} from '../types'

// Generic error handler
const handleError = (error: any, operation: string) => {
  console.error(`Database ${operation} error:`, error)
  throw new Error(`Failed to ${operation}: ${error.message}`)
}

// Generic success handler
const handleSuccess = <T>(data: T, operation: string): T => {
  console.log(`Database ${operation} successful:`, data)
  return data
}

// TRUCKS
export const truckService = {
  async getAll(): Promise<Truck[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.TRUCKS)
        .select('*')
        .order('arrivalTime', { ascending: false })
      
      if (error) throw error
      return handleSuccess(data || [], 'fetch trucks')
    } catch (error) {
      handleError(error, 'fetch trucks')
      return []
    }
  },

  async getById(id: string): Promise<Truck | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.TRUCKS)
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return handleSuccess(data, 'fetch truck')
    } catch (error) {
      handleError(error, 'fetch truck')
      return null
    }
  },

  async create(truck: Omit<Truck, 'id'>): Promise<Truck | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.TRUCKS)
        .insert([truck])
        .select()
        .single()
      
      if (error) throw error
      return handleSuccess(data, 'create truck')
    } catch (error) {
      handleError(error, 'create truck')
      return null
    }
  },

  async update(id: string, updates: Partial<Truck>): Promise<Truck | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.TRUCKS)
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return handleSuccess(data, 'update truck')
    } catch (error) {
      handleError(error, 'update truck')
      return null
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(TABLES.TRUCKS)
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return handleSuccess(true, 'delete truck')
    } catch (error) {
      handleError(error, 'delete truck')
      return false
    }
  }
}

// ORDERS
export const orderService = {
  async getAll(): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.ORDERS)
        .select('*')
        .order('createdAt', { ascending: false })
      
      if (error) throw error
      return handleSuccess(data || [], 'fetch orders')
    } catch (error) {
      handleError(error, 'fetch orders')
      return []
    }
  },

  async getById(id: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.ORDERS)
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return handleSuccess(data, 'fetch order')
    } catch (error) {
      handleError(error, 'fetch order')
      return null
    }
  },

  async create(order: Omit<Order, 'id'>): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.ORDERS)
        .insert([order])
        .select()
        .single()
      
      if (error) throw error
      return handleSuccess(data, 'create order')
    } catch (error) {
      handleError(error, 'create order')
      return null
    }
  },

  async update(id: string, updates: Partial<Order>): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.ORDERS)
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return handleSuccess(data, 'update order')
    } catch (error) {
      handleError(error, 'update order')
      return null
    }
  }
}

// DISPATCHES
export const dispatchService = {
  async getAll(): Promise<Dispatch[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.DISPATCHES)
        .select('*')
        .order('createdAt', { ascending: false })
      
      if (error) throw error
      return handleSuccess(data || [], 'fetch dispatches')
    } catch (error) {
      handleError(error, 'fetch dispatches')
      return []
    }
  },

  async getById(id: string): Promise<Dispatch | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.DISPATCHES)
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return handleSuccess(data, 'fetch dispatch')
    } catch (error) {
      handleError(error, 'fetch dispatch')
      return null
    }
  },

  async create(dispatch: Omit<Dispatch, 'id'>): Promise<Dispatch | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.DISPATCHES)
        .insert([dispatch])
        .select()
        .single()
      
      if (error) throw error
      return handleSuccess(data, 'create dispatch')
    } catch (error) {
      handleError(error, 'create dispatch')
      return null
    }
  },

  async update(id: string, updates: Partial<Dispatch>): Promise<Dispatch | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.DISPATCHES)
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return handleSuccess(data, 'update dispatch')
    } catch (error) {
      handleError(error, 'update dispatch')
      return null
    }
  }
}

// MATERIALS
export const materialService = {
  async getAll(): Promise<Material[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.MATERIALS)
        .select('*')
        .eq('active', true)
        .order('name')
      
      if (error) throw error
      return handleSuccess(data || [], 'fetch materials')
    } catch (error) {
      handleError(error, 'fetch materials')
      return []
    }
  },

  async create(material: Omit<Material, 'id'>): Promise<Material | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.MATERIALS)
        .insert([material])
        .select()
        .single()
      
      if (error) throw error
      return handleSuccess(data, 'create material')
    } catch (error) {
      handleError(error, 'create material')
      return null
    }
  }
}

// CATEGORIES
export const categoryService = {
  async getAll(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.CATEGORIES)
        .select('*')
        .eq('active', true)
        .order('name')
      
      if (error) throw error
      return handleSuccess(data || [], 'fetch categories')
    } catch (error) {
      handleError(error, 'fetch categories')
      return []
    }
  }
}

// EXCEPTIONS
export const exceptionService = {
  async getAll(): Promise<Exception[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.EXCEPTIONS)
        .select('*')
        .order('createdAt', { ascending: false })
      
      if (error) throw error
      return handleSuccess(data || [], 'fetch exceptions')
    } catch (error) {
      handleError(error, 'fetch exceptions')
      return []
    }
  },

  async create(exception: Omit<Exception, 'id'>): Promise<Exception | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.EXCEPTIONS)
        .insert([exception])
        .select()
        .single()
      
      if (error) throw error
      return handleSuccess(data, 'create exception')
    } catch (error) {
      handleError(error, 'create exception')
      return null
    }
  },

  async update(id: string, updates: Partial<Exception>): Promise<Exception | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.EXCEPTIONS)
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return handleSuccess(data, 'update exception')
    } catch (error) {
      handleError(error, 'update exception')
      return null
    }
  }
}

// TRUCK PROCESSES
export const truckProcessService = {
  async getAll(): Promise<TruckProcess[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.TRUCK_PROCESSES)
        .select('*')
        .order('startTime', { ascending: false })
      
      if (error) throw error
      return handleSuccess(data || [], 'fetch truck processes')
    } catch (error) {
      handleError(error, 'fetch truck processes')
      return []
    }
  },

  async getById(id: string): Promise<TruckProcess | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.TRUCK_PROCESSES)
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return handleSuccess(data, 'fetch truck process')
    } catch (error) {
      handleError(error, 'fetch truck process')
      return null
    }
  },

  async create(process: Omit<TruckProcess, 'id'>): Promise<TruckProcess | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.TRUCK_PROCESSES)
        .insert([process])
        .select()
        .single()
      
      if (error) throw error
      return handleSuccess(data, 'create truck process')
    } catch (error) {
      handleError(error, 'create truck process')
      return null
    }
  },

  async update(id: string, updates: Partial<TruckProcess>): Promise<TruckProcess | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.TRUCK_PROCESSES)
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return handleSuccess(data, 'update truck process')
    } catch (error) {
      handleError(error, 'update truck process')
      return null
    }
  }
}

// USERS
export const userService = {
  async getAll(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .order('name')
      
      if (error) throw error
      return handleSuccess(data || [], 'fetch users')
    } catch (error) {
      handleError(error, 'fetch users')
      return []
    }
  },

  async getById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return handleSuccess(data, 'fetch user')
    } catch (error) {
      handleError(error, 'fetch user')
      return null
    }
  }
}

// Real-time subscriptions
export const subscribeToChanges = (table: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe()
}
