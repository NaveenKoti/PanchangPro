export interface CachedPanchangData {
  id: string
  date: string
  location: {
    latitude: number
    longitude: number
    timezone: string
  }
  panchang: any
  calculationDate: string
  ttl: number
}

export interface CacheStats {
  totalEntries: number
  cacheSize: string
  oldestEntry?: string
  newestEntry?: string
}

class PanchangCacheService {
  private dbName = 'VedaTimePanchangDB'
  private storeName = 'panchangCalculations'
  private db: IDBDatabase | null = null
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000
  private readonly recalculationHour = 4

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve()
        return
      }

      const request = indexedDB.open(this.dbName, 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        const store = db.createObjectStore(this.storeName, { keyPath: 'id' })
        store.createIndex('date', 'date', { unique: false })
        store.createIndex('location', 'location', { unique: false })
        store.createIndex('calculationDate', 'calculationDate', { unique: false })
      }
    })
  }

  private getCacheId(date: string, latitude: number, longitude: number): string {
    return `${date}-${latitude.toFixed(4)}-${longitude.toFixed(4)}`
  }

  async getPanchangCalculation(
    date: string, 
    latitude: number, 
    longitude: number, 
    timezone: string
  ): Promise<any | null> {
    if (!this.db) await this.init()
    if (!this.db) return null

    const id = this.getCacheId(date, latitude, longitude)

    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve(null)
        return
      }

      const transaction = this.db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.get(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const cached = request.result as CachedPanchangData | undefined
        if (!cached) {
          resolve(null)
          return
        }

        const now = new Date().getTime()
        const cacheTime = new Date(cached.calculationDate).getTime()

        if (now - cacheTime > this.CACHE_DURATION) {
          this.deleteExpiredEntry(id)
          resolve(null)
          return
        }

        resolve(cached.panchang)
      }
    })
  }

  async storePanchangCalculation(
    date: string, 
    latitude: number, 
    longitude: number, 
    timezone: string, 
    panchangData: any
  ): Promise<void> {
    if (!this.db) await this.init()
    if (!this.db) return

    const id = this.getCacheId(date, latitude, longitude)
    const calcId = this.getCacheId(new Date().toISOString().split('T')[0], latitude, longitude)

    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve()
        return
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)

      const cachedData: CachedPanchangData = {
        id,
        date,
        location: {
          latitude,
          longitude,
          timezone
        },
        panchang: panchangData,
        calculationDate: new Date().toISOString(),
        ttl: this.CACHE_DURATION
      }

      const request = store.put(cachedData)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async clearCache(): Promise<void> {
    if (!this.db) await this.init()
    if (!this.db) return

    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve()
        return
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.clear()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getCacheStats(): Promise<CacheStats> {
    if (!this.db) await this.init()
    if (!this.db) {
      return {
        totalEntries: 0,
        cacheSize: '0 KB'
      }
    }

    return new Promise((resolve) => {
      if (!this.db) {
        resolve({
          totalEntries: 0,
          cacheSize: '0 KB'
        })
        return
      }

      const transaction = this.db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.getAll()

      request.onerror = () => {
        resolve({
          totalEntries: 0,
          cacheSize: '0 KB'
        })
      }

      request.onsuccess = () => {
        const allData = request.result as CachedPanchangData[]
        const stats: CacheStats = {
          totalEntries: allData.length,
          cacheSize: `${Math.round(JSON.stringify(allData).length / 1024)} KB`,
          oldestEntry: allData.length > 0 ? allData[0]?.calculationDate : undefined,
          newestEntry: allData.length > 0 ? allData[allData.length - 1]?.calculationDate : undefined
        }
        resolve(stats)
      }
    })
  }

  async deleteExpiredEntry(id: string): Promise<void> {
    if (!this.db) return

    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve()
        return
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.delete(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  public isAutomaticRecalculationNeeded(): boolean {
    const now = new Date()
    const currentHour = now.getHours()
    const lastCheckTime = localStorage.getItem('vedatime_last_cache_check')

    if (!lastCheckTime) {
      localStorage.setItem('vedatime_last_cache_check', now.toISOString())
      return true
    }

    const lastCheck = new Date(lastCheckTime)
    const hoursSinceLastCheck = (now.getTime() - lastCheck.getTime()) / (1000 * 60 * 60)

    const isRecalculationHour = currentHour >= this.recalculationHour && currentHour < (this.recalculationHour + 1)
    const isNewDay = hoursSinceLastCheck >= 24

    if (isRecalculationHour && isNewDay) {
      localStorage.setItem('vedatime_last_cache_check', now.toISOString())
      return true
    }

    return false
  }

  public scheduleDailyRecalculation(callback: () => void): void {
    const now = new Date()
    const nextRecalculationTime = new Date()
    
    nextRecalculationTime.setHours(this.recalculationHour, 0, 0, 0)
    
    if (nextRecalculationTime <= now) {
      nextRecalculationTime.setDate(nextRecalculationTime.getDate() + 1)
    }

    const msUntilRecalculation = nextRecalculationTime.getTime() - now.getTime()

    window.setTimeout(() => {
      callback()
      
      window.setInterval(callback, 24 * 60 * 60 * 1000)
    }, msUntilRecalculation)
  }

  public async shouldUseCache(date: string): Promise<boolean> {
    if (date === new Date().toISOString().split('T')[0]) {
      const lastCheckTime = localStorage.getItem('vedatime_current_date_check')
      
      if (!lastCheckTime) {
        localStorage.setItem('vedatime_current_date_check', new Date().toISOString())
        return false
      }

      const lastCheck = new Date(lastCheckTime)
      const now = new Date()
      const hoursSinceLastCheck = (now.getTime() - lastCheck.getTime()) / (1000 * 60 * 60)

      if (hoursSinceLastCheck > 12) {
        localStorage.setItem('vedatime_current_date_check', now.toISOString())
        return false
      }
    }

    return true
  }
}

export default new PanchangCacheService()
