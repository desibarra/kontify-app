/**
 * Web Storage Adapter
 * Uses localStorage for web persistence.
 */
export class SupabaseStorageAdapter {
    getItem(key: string): string | null {
        if (typeof localStorage === 'undefined') return null;
        return localStorage.getItem(key);
    }

    setItem(key: string, value: string): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(key, value);
        }
    }

    removeItem(key: string): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(key);
        }
    }
}
