import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

const COLLECTION_NAME = 'users';

export const authService = {
  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if profile exists
      const profileRef = doc(db, COLLECTION_NAME, user.uid);
      const profileSnap = await getDoc(profileRef);
      
      if (!profileSnap.exists()) {
        // Create default profile (student by default, unless email is specifically admin-like or we have a more complex logic)
        // For this demo, let's assume if they have a 'teacher' in their email or display name, they are a teacher.
        // Or simply let them choose, but for now we default to student and provide a toggle in the UI.
        const isTeacherEmail = user.email?.includes('teacher') || false;
        
        const newProfile: UserProfile = {
          uid: user.uid,
          displayName: user.displayName || 'Anonymous User',
          email: user.email || '',
          role: isTeacherEmail ? UserRole.TEACHER : UserRole.STUDENT,
        };
        
        await setDoc(profileRef, {
          ...newProfile,
          createdAt: serverTimestamp(),
        });
        return newProfile;
      }
      
      return profileSnap.data() as UserProfile;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  subscribeToAuthChanges: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  getUserProfile: async (uid: string) => {
    const profileRef = doc(db, COLLECTION_NAME, uid);
    const profileSnap = await getDoc(profileRef);
    return profileSnap.exists() ? (profileSnap.data() as UserProfile) : null;
  },

  toggleRole: async (uid: string, currentRole: UserRole) => {
    const newRole = currentRole === UserRole.TEACHER ? UserRole.STUDENT : UserRole.TEACHER;
    const profileRef = doc(db, COLLECTION_NAME, uid);
    await setDoc(profileRef, { role: newRole }, { merge: true });
    return newRole;
  }
};
