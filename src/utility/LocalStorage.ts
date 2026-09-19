export function setLocalStorageItem(key: string, value: unknown): void {
  try {
    if (value === undefined) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  } catch (error) {
    console.error(`Error saving key "${key}" to localStorage:`, error)
  }
}

export function getLocalStorageItem<T = any>(key: string): T | null {
  try {
    const value = localStorage.getItem(key)

    if (!value || value === 'undefined' || value === 'null') {
      return null
    }

    try {
      return JSON.parse(value) as T
    } catch {
      return value as unknown as T
    }
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage:`, error)
    return null
  }
}