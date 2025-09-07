/**
 * Wishlist Priority
 */
export const WISHLIST_PRIORITY = {
  LOW: {
    label: "Low",
    color: "bg-emerald-500 text-white",
  },
  MEDIUM: {
    label: "Medium",
    color: "bg-orange-500 text-white",
  },
  HIGH: {
    label: "High",
    color: "bg-red-600 text-white",
  },
};



export function getWishlistPriority(priority: string) {
  return WISHLIST_PRIORITY[priority.toUpperCase() as keyof typeof WISHLIST_PRIORITY] ?? WISHLIST_PRIORITY.LOW;
}