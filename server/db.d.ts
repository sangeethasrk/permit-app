export function run(
  query: string,
  params?: unknown[],
): Promise<{ lastID: number; changes: number }>

export function get<T = unknown>(query: string, params?: unknown[]): Promise<T | undefined>
export function all<T = unknown>(query: string, params?: unknown[]): Promise<T[]>

export function initDb(): Promise<void>
