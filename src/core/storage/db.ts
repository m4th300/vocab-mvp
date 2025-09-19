// src/core/storage/db.ts
import {
  openDB,
  type IDBPDatabase,
  type IDBPObjectStore,
  type DBSchema
} from 'idb';
import type { Card } from '@/core/models/card';
import type { Folder } from '@/core/models/folder';
import type { Tag } from '@/core/models/tag';

/** Noms de stores explicitement typés (évite que keyof devienne "string") */
export type StoreName = 'cards' | 'folders' | 'tags';

interface VocabDB extends DBSchema {
  cards: {
    key: string;
    value: Card;
    indexes: {
      by_folder: string;
      by_created: string;
      by_updated: string;
    };
  };
  folders: {
    key: string;
    value: Folder;
    indexes: {
      /** même si parentId peut être undefined dans les données, l’index tape la clé comme string */
      by_parent: string;
      by_name: string;
    };
  };
  tags: {
    key: string;
    value: Tag;
  };
}

let _dbPromise: Promise<IDBPDatabase<VocabDB>> | null = null;

export async function getDB(): Promise<IDBPDatabase<VocabDB>> {
  if (!_dbPromise) {
    _dbPromise = openDB<VocabDB>('vocab-mvp-db', 1, {
      upgrade(db) {
        // folders
        if (!db.objectStoreNames.contains('folders')) {
          const store = db.createObjectStore('folders', { keyPath: 'id' });
          store.createIndex('by_parent', 'parentId');
          store.createIndex('by_name', 'name');
        }
        // cards
        if (!db.objectStoreNames.contains('cards')) {
          const store = db.createObjectStore('cards', { keyPath: 'id' });
          store.createIndex('by_folder', 'folderId');
          store.createIndex('by_created', 'createdAt');
          store.createIndex('by_updated', 'updatedAt');
        }
        // tags
        if (!db.objectStoreNames.contains('tags')) {
          db.createObjectStore('tags', { keyPath: 'id' });
        }
      }
    });
  }
  return _dbPromise;
}

/**
 * Helper générique, avec union littéral pour les stores.
 * On caste légèrement la `store` retournée par la TX pour matcher la signature stricte.
 */
export async function withStore<S extends StoreName, M extends IDBTransactionMode, R>(
  storeName: S,
  mode: M,
  fn: (store: IDBPObjectStore<VocabDB, [StoreName], S, M>) => Promise<R>
): Promise<R> {
  const db = await getDB();
  const tx = db.transaction(storeName, mode);
  const store = tx.objectStore(storeName) as IDBPObjectStore<
    VocabDB,
    [StoreName],
    S,
    M
  >;
  const res = await fn(store);
  await tx.done;
  return res;
}
