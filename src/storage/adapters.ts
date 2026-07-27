import type { Patch } from 'immer'

import { __trace } from '../trace.js'

export interface ThunkParams {
  action: unknown
  patches?: Patch[]
  state?: unknown
  previousState?: unknown
}

interface LocalStorageConfig {
  name: string
  version: number
}

export interface LocalStorageAdapter<T = any> {
  getState(): Promise<T | null>
  setState(state: T): Promise<void>
  name: string
  version: number
}

type VersionStatus = 'create' | 'update' | 'current'

const VERSION_KEY_PREFIX = '__cami_ls_version_'

export function createLocalStorage<T = any>({
  name,
  version,
}: LocalStorageConfig): LocalStorageAdapter<T> {
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error('name must be a non-empty string')
  }
  if (!Number.isInteger(version) || version <= 0) {
    throw new Error('version must be a positive integer')
  }

  const versionKey = `${VERSION_KEY_PREFIX}${name}`
  const checkVersion = (): VersionStatus => {
    const storedVersion = localStorage.getItem(versionKey)
    if (storedVersion === null) {
      localStorage.setItem(versionKey, version.toString())
      return 'create'
    }
    if (Number.parseInt(storedVersion, 10) < version) {
      localStorage.setItem(versionKey, version.toString())
      return 'update'
    }
    return 'current'
  }

  const versionStatus = checkVersion()
  if (versionStatus === 'update') {
    localStorage.removeItem(name)
    __trace(`localStorage:version`, `Reset ${name} for storage version ${version}`)
  } else if (versionStatus === 'create') {
    __trace(`localStorage:version`, `Created ${name} with version ${version}`)
  }

  return {
    async getState(): Promise<T | null> {
      const data = localStorage.getItem(name)
      return data ? (JSON.parse(data) as T) : null
    },

    async setState(state: T): Promise<void> {
      localStorage.setItem(name, JSON.stringify(state))
    },

    name,
    version,
  }
}

export function persistToLocalStorageThunk<T = any>(toLocalStorage: LocalStorageAdapter<T>) {
  return async ({ action: _action, state, previousState }: ThunkParams): Promise<void> => {
    if (state !== previousState) {
      await toLocalStorage.setState(state as T)
      __trace(`localStorage:update`, `Updated ${toLocalStorage.name} with entire state`)
    }
  }
}
