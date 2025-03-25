import { DatabaseMockConfig, DatabaseRecord } from "../types";

/**
 * Mock database implementation for testing
 *
 * @param config - Initial data configuration
 * @returns Mocked database instance
 */
export function mockDatabase(config: DatabaseMockConfig = {}) {
  // Create storage for mock data
  const storage: Record<string, DatabaseRecord[]> = {};

  // Initialize with provided data
  Object.entries(config).forEach(([table, data]) => {
    if (data) {
      storage[table] = [...data];
    } else {
      storage[table] = [];
    }
  });

  return {
    /**
     * Query the mock database
     *
     * @param tableName - Table to query
     * @param queryFn - Filter function
     * @returns Matching records
     */
    query: <T extends DatabaseRecord>(
      tableName: string,
      queryFn?: (item: T) => boolean,
    ) => {
      const table = storage[tableName] || [];

      if (!queryFn) {
        return Promise.resolve([...table] as T[]);
      }

      return Promise.resolve(
        table.filter(queryFn as (item: DatabaseRecord) => boolean) as T[],
      );
    },

    /**
     * Find a single record
     *
     * @param tableName - Table to query
     * @param id - Record ID
     * @returns Matching record or null
     */
    findById: <T extends DatabaseRecord>(tableName: string, id: string) => {
      const table = storage[tableName] || [];
      const item = table.find((item) => item.id === id);

      return Promise.resolve(item ? ({ ...item } as T) : null);
    },

    /**
     * Insert a record
     *
     * @param tableName - Table to insert into
     * @param data - Record data
     * @returns Inserted record
     */
    insert: <T extends DatabaseRecord>(tableName: string, data: T) => {
      if (!storage[tableName]) {
        storage[tableName] = [];
      }

      const newItem = { ...data };
      storage[tableName].push(newItem);

      return Promise.resolve({ ...newItem } as T);
    },

    /**
     * Update a record
     *
     * @param tableName - Table to update
     * @param id - Record ID
     * @param data - New data
     * @returns Updated record
     */
    update: <T extends DatabaseRecord>(
      tableName: string,
      id: string,
      data: Partial<T>,
    ) => {
      const table = storage[tableName] || [];
      const index = table.findIndex((item) => item.id === id);

      if (index === -1) {
        return Promise.reject(
          new Error(`Record with id ${id} not found in ${tableName}`),
        );
      }

      const updated = { ...table[index], ...data };
      table[index] = updated;

      return Promise.resolve({ ...updated } as T);
    },

    /**
     * Delete a record
     *
     * @param tableName - Table to delete from
     * @param id - Record ID
     * @returns Success status
     */
    delete: (tableName: string, id: string) => {
      const table = storage[tableName] || [];
      const index = table.findIndex((item) => item.id === id);

      if (index === -1) {
        return Promise.reject(
          new Error(`Record with id ${id} not found in ${tableName}`),
        );
      }

      table.splice(index, 1);

      return Promise.resolve(true);
    },

    /**
     * Clear all data or specific table
     *
     * @param tableName - Optional table to clear
     */
    clear: (tableName?: string) => {
      if (tableName) {
        storage[tableName] = [];
      } else {
        Object.keys(storage).forEach((key) => {
          storage[key] = [];
        });
      }

      return Promise.resolve();
    },

    /**
     * Raw access to storage
     */
    _storage: storage,
  };
}
