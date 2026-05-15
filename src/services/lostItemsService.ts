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
  createItem: async (itemData: Omit<LostItem, 'id' | 'createdAt' | 'updatedAt' | 'creatorId' | 'status'>) => {
    const { privateNote, ...publicData } = itemData;

    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...publicData,
        status: ItemStatus.AVAILABLE,
        creatorId: 'teacher',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      if (privateNote) {
        await setDoc(doc(db, COLLECTION_NAME, docRef.id, 'private', 'note'), {
          content: privateNote,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
    }
  },

  // Get private note for an item (Teachers only)
  getPrivateNote: async (itemId: string) => {
    try {
      const noteRef = doc(db, COLLECTION_NAME, itemId, 'private', 'note');
      const noteSnap = await getDoc(noteRef);
      return noteSnap.exists() ? noteSnap.data().content : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${itemId}/private/note`);
    }
  },

  // Mark as collected (deletes or updates status)
  collectItem: async (itemId: string) => {
    try {
      const itemRef = doc(db, COLLECTION_NAME, itemId);
      await updateDoc(itemRef, {
        status: ItemStatus.COLLECTED,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${itemId}`);
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
