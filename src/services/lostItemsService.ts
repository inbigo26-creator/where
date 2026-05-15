import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where,
  getDocs,
  serverTimestamp,
  getCountFromServer,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { LostItem, ItemStatus } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: 'anonymous',
      email: null,
      emailVerified: null,
      isAnonymous: true,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const COLLECTION_NAME = 'lostItems';

export const lostItemsService = {
  // Get real-time count of available items
  subscribeToAvailableCount: (callback: (count: number) => void) => {
    const q = query(collection(db, COLLECTION_NAME), where('status', '==', ItemStatus.AVAILABLE));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.size);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
    });
  },

  // Get items list
  subscribeToItems: (callback: (items: LostItem[]) => void) => {
    const q = query(collection(db, COLLECTION_NAME), where('status', '==', ItemStatus.AVAILABLE));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LostItem[];
      callback(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
    });
  },

  // Create new item
  createItem: async (itemData: Omit<LostItem, 'id' | 'createdAt' | 'updatedAt' | 'creatorId' | 'status' | 'privateNote'>) => {
    try {
      await addDoc(collection(db, COLLECTION_NAME), {
        ...itemData,
        status: ItemStatus.AVAILABLE,
        creatorId: 'teacher',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
    }
  },

  // Mark as collected (User requested actual deletion from DB)
  collectItem: async (itemId: string) => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, itemId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${itemId}`);
    }
  },

  // Cleanup items older than 30 days
  cleanupOldItems: async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const q = query(collection(db, COLLECTION_NAME), where('createdAt', '<=', thirtyDaysAgo));
      const snapshot = await getDocs(q);
      
      const deletePromises = snapshot.docs.map(document => deleteDoc(doc(db, COLLECTION_NAME, document.id)));
      await Promise.all(deletePromises);
      
      if (snapshot.size > 0) {
        console.log(`Cleaned up ${snapshot.size} expired items.`);
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  },

  // Delete item
  deleteItem: async (itemId: string) => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, itemId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${itemId}`);
    }
  }
};
