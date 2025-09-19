"use client";

import { create } from "zustand";

interface AuthStore {
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
  openDropdown: () => void;
  closeDropdown: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isDropdownOpen: false,
  toggleDropdown: () => set((state) => ({ isDropdownOpen: !state.isDropdownOpen })),
  openDropdown: () => set({ isDropdownOpen: true }),
  closeDropdown: () => set({ isDropdownOpen: false }),
}));

// Selector hooks for better performance
export const useAuthDropdownOpen = () => useAuthStore((state) => state.isDropdownOpen);
