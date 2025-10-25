import { create } from 'zustand';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, firestoreDB } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export const useAuthStore = create((set) => {
  let unsubscribeAuth = null;
  
  const startAuthListener = () => {
    unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(firestoreDB, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();

            set({
              user,
              role: data.role || null,
              isAccepted: data.isAccepted ?? false,
              // ✅ use Firestore's isVerified instead of emailVerified
              isVerified: data.isVerified ?? false,
              loading: false,
              justLoggedIn: false,
            });
          } else {
            // User logged in but no Firestore doc yet
            set({
              user,
              role: null,
              isAccepted: false,
              isVerified: false,
              loading: false,
              justLoggedIn: false,
            });
          }
        } catch (error) {
          console.error("❌ Error fetching user data:", error);
          set({
            user,
            role: null,
            isAccepted: false,
            isVerified: false,
            loading: false,
            justLoggedIn: false,
          });
        }
      } else {
        set({
          user: null,
          role: null,
          isAccepted: false,
          isVerified: false,
          loading: false,
          justLoggedIn: false,
        });
      }
    });
  };

  startAuthListener();

  return {
    user: null,
    role: null,
    isAccepted: false,
    isVerified: false,
    loading: true,
    justLoggedIn: false,
    setUser: (user, role, isAccepted = false, isVerified = false, justLoggedIn = false) => set({ user, role, isAccepted, isVerified, justLoggedIn }),
    logout: async () => {
      await signOut(auth);
      set({ user: null, role: null, isAccepted: false, isVerified: false, loading: false, justLoggedIn: false });
    },
  };
});
