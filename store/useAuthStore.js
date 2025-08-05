import { create } from 'zustand';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export const useAuthStore = create((set) => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      const role = docSnap.exists() ? docSnap.data().role : null;
      set({ user, role, loading: false });
    } else {
      set({ user: null, role: null, loading: false });
    }
  });

  return {
    user: null,
    role: null,
    loading: true,
    setUser: (user, role) => set({ user, role }),
  };
});
