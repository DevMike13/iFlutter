import { create } from 'zustand';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, firestoreDB } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export const useAuthStore = create((set) => {
  let unsubscribeAuth = null;
  
  const startAuthListener = () => {
    unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(firestoreDB, 'users', user.uid));
        const role = docSnap.exists() ? docSnap.data().role : null;
        set({ user, role, loading: false });
      } else {
        set({ user: null, role: null, loading: false });
      }
    });
  };

  startAuthListener();

  return {
    user: null,
    role: null,
    loading: true,
    setUser: (user, role) => set({ user, role }),
    logout: async () => {
      await signOut(auth);
      set({ user: null, role: null, loading: false });
    },
  };
});
