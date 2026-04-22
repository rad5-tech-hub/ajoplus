// src/app/store/PackageStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface JoinedPackage {
  id: string;
  title: string;
  price: number;
  category: string;
  duration: string;
  frequency: string;
  progress: number;
  description: string;
  packageItems: string[];
  joinedDate: string;
  status: 'Active' | 'Completed';
  totalPaid: string;
  remaining: string;
  nextDue: string;
}

interface PackageStore {
  packages: JoinedPackage[];
  joinPackage: (pkg: Omit<JoinedPackage, 'joinedDate' | 'status' | 'totalPaid' | 'remaining' | 'nextDue'>) => void;
  removePackage: (id: string) => void;
  getPackageById: (id: string) => JoinedPackage | undefined;
  getPackages: () => JoinedPackage[];
}

export const usePackageStore = create<PackageStore>()(
  persist(
    (set, get) => ({
      packages: [],
      joinPackage: (pkg) =>
        set((state) => {
          const existingPackage = state.packages.find((p) => p.id === pkg.id);

          if (existingPackage) {
            return state; // Package already joined
          }

          const newPackage: JoinedPackage = {
            ...pkg,
            joinedDate: new Date().toISOString().split('T')[0],
            status: 'Active',
            totalPaid: '₦0',
            remaining: `₦${pkg.price.toLocaleString()}`,
            nextDue: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          };

          return {
            packages: [...state.packages, newPackage],
          };
        }),
      removePackage: (id) =>
        set((state) => ({
          packages: state.packages.filter((pkg) => pkg.id !== id),
        })),
      getPackageById: (id) => get().packages.find((pkg) => pkg.id === id),
      getPackages: () => get().packages,
    }),
    { name: 'ajoplus-packages' }
  )
);
