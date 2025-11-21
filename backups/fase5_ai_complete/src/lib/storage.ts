import * as SecureStore from 'expo-secure-store';

/**
 * LargeSecureStoreAdapter
 * 
 * Expo SecureStore tiene un límite de 2KB por key.
 * Este adapter divide datos grandes en chunks para evitar ese límite.
 */
export class SupabaseStorageAdapter {
    private chunkSize = 2048; // 2KB - límite de SecureStore

    async setItem(key: string, value: string): Promise<void> {
        try {
            if (value.length <= this.chunkSize) {
                await SecureStore.setItemAsync(key, value);
                await this.removeChunks(key);
                return;
            }

            const chunks = this.splitIntoChunks(value);

            for (let i = 0; i < chunks.length; i++) {
                const chunkKey = `${key}_chunk_${i}`;
                await SecureStore.setItemAsync(chunkKey, chunks[i]);
            }

            await SecureStore.setItemAsync(
                `${key}_metadata`,
                JSON.stringify({ chunks: chunks.length })
            );

            await SecureStore.deleteItemAsync(key).catch(() => { });
        } catch (error) {
            console.error('Error saving to SecureStore:', error);
            throw error;
        }
    }

    async getItem(key: string): Promise<string | null> {
        try {
            const directValue = await SecureStore.getItemAsync(key);
            if (directValue) {
                return directValue;
            }

            const metadataStr = await SecureStore.getItemAsync(`${key}_metadata`);
            if (!metadataStr) {
                return null;
            }

            const metadata = JSON.parse(metadataStr);
            const chunks: string[] = [];

            for (let i = 0; i < metadata.chunks; i++) {
                const chunkKey = `${key}_chunk_${i}`;
                const chunk = await SecureStore.getItemAsync(chunkKey);
                if (!chunk) {
                    throw new Error(`Missing chunk ${i} for key ${key}`);
                }
                chunks.push(chunk);
            }

            return chunks.join('');
        } catch (error) {
            console.error('Error reading from SecureStore:', error);
            return null;
        }
    }

    async removeItem(key: string): Promise<void> {
        try {
            await SecureStore.deleteItemAsync(key).catch(() => { });
            await this.removeChunks(key);
            await SecureStore.deleteItemAsync(`${key}_metadata`).catch(() => { });
        } catch (error) {
            console.error('Error removing from SecureStore:', error);
        }
    }

    private splitIntoChunks(str: string): string[] {
        const chunks: string[] = [];
        for (let i = 0; i < str.length; i += this.chunkSize) {
            chunks.push(str.substring(i, i + this.chunkSize));
        }
        return chunks;
    }

    private async removeChunks(key: string): Promise<void> {
        try {
            const metadataStr = await SecureStore.getItemAsync(`${key}_metadata`);
            if (!metadataStr) return;

            const metadata = JSON.parse(metadataStr);
            for (let i = 0; i < metadata.chunks; i++) {
                const chunkKey = `${key}_chunk_${i}`;
                await SecureStore.deleteItemAsync(chunkKey).catch(() => { });
            }
        } catch (error) {
            // Ignorar errores al limpiar chunks
        }
    }
}
