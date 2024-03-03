import { create } from "zustand";

export const useToken = create((set) => ({
  firebaseToken: 0,
  setFirebaseToken: (firebaseToken) => {
    set({ firebaseToken });
  },
}));
// export const useDataStore = create((set) => ({
//   firebaseToken: 0,
//   setFirebaseToken: () => set((firebaseToken) => ({ firebaseToken })),
// }));
