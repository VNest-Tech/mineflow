import { useState, useEffect, useCallback } from 'react'
import { 
  truckService, 
  orderService, 
  dispatchService, 
  materialService, 
  categoryService, 
  exceptionService, 
  truckProcessService, 
  userService,
  subscribeToChanges 
} from '../services/database'
import type { 
  Truck, 
  Order, 
  Dispatch, 
  Material, 
  Category, 
  Exception, 
  TruckProcess, 
  User 
} from '../types'

// Generic hook for managing data with loading and error states
function useData<T>(
  fetchFunction: () => Promise<T[]>,
  tableName: string
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchFunction()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [fetchFunction])

  useEffect(() => {
    fetchData()

    // Subscribe to real-time changes
    const subscription = subscribeToChanges(tableName, (payload) => {
      if (payload.eventType === 'INSERT') {
        setData(prev => [payload.new as T, ...prev])
      } else if (payload.eventType === 'UPDATE') {
        setData(prev => prev.map(item => 
          (item as any).id === payload.new.id ? payload.new as T : item
        ))
      } else if (payload.eventType === 'DELETE') {
        setData(prev => prev.filter(item => (item as any).id !== payload.old.id))
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchData, tableName])

  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refresh }
}

// Truck hooks
export const useTrucks = () => useData(truckService.getAll, 'trucks')
export const useTruck = (id: string) => {
  const [truck, setTruck] = useState<Truck | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchTruck = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await truckService.getById(id)
        setTruck(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTruck()
  }, [id])

  return { truck, loading, error }
}

// Order hooks
export const useOrders = () => useData(orderService.getAll, 'orders')
export const useOrder = (id: string) => {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchOrder = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await orderService.getById(id)
        setOrder(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  return { order, loading, error }
}

// Dispatch hooks
export const useDispatches = () => useData(dispatchService.getAll, 'dispatches')
export const useDispatch = (id: string) => {
  const [dispatch, setDispatch] = useState<Dispatch | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchDispatch = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await dispatchService.getById(id)
        setDispatch(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchDispatch()
  }, [id])

  return { dispatch, loading, error }
}

// Material hooks
export const useMaterials = () => useData(materialService.getAll, 'materials')

// Category hooks
export const useCategories = () => useData(categoryService.getAll, 'categories')

// Exception hooks
export const useExceptions = () => useData(exceptionService.getAll, 'exceptions')

// Truck Process hooks
export const useTruckProcesses = () => useData(truckProcessService.getAll, 'truck_processes')
export const useTruckProcess = (id: string) => {
  const [process, setProcess] = useState<TruckProcess | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchProcess = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await truckProcessService.getById(id)
        setProcess(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProcess()
  }, [id])

  return { process, loading, error }
}

// User hooks
export const useUsers = () => useData(userService.getAll, 'users')
export const useUser = (id: string) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchUser = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await userService.getById(id)
        setUser(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [id])

  return { user, loading, error }
}

// Mutation hooks
export const useTruckMutations = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createTruck = useCallback(async (truck: Omit<Truck, 'id'>) => {
    try {
      setLoading(true)
      setError(null)
      const result = await truckService.create(truck)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTruck = useCallback(async (id: string, updates: Partial<Truck>) => {
    try {
      setLoading(true)
      setError(null)
      const result = await truckService.update(id, updates)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteTruck = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await truckService.delete(id)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createTruck,
    updateTruck,
    deleteTruck,
    loading,
    error
  }
}

export const useOrderMutations = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOrder = useCallback(async (order: Omit<Order, 'id'>) => {
    try {
      setLoading(true)
      setError(null)
      const result = await orderService.create(order)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateOrder = useCallback(async (id: string, updates: Partial<Order>) => {
    try {
      setLoading(true)
      setError(null)
      const result = await orderService.update(id, updates)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createOrder,
    updateOrder,
    loading,
    error
  }
}

export const useDispatchMutations = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createDispatch = useCallback(async (dispatch: Omit<Dispatch, 'id'>) => {
    try {
      setLoading(true)
      setError(null)
      const result = await dispatchService.create(dispatch)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateDispatch = useCallback(async (id: string, updates: Partial<Dispatch>) => {
    try {
      setLoading(true)
      setError(null)
      const result = await dispatchService.update(id, updates)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createDispatch,
    updateDispatch,
    loading,
    error
  }
}

export const useExceptionMutations = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createException = useCallback(async (exception: Omit<Exception, 'id'>) => {
    try {
      setLoading(true)
      setError(null)
      const result = await exceptionService.create(exception)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateException = useCallback(async (id: string, updates: Partial<Exception>) => {
    try {
      setLoading(true)
      setError(null)
      const result = await exceptionService.update(id, updates)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createException,
    updateException,
    loading,
    error
  }
}
