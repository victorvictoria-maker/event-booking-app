import { SortOrder } from "mongoose";

export function getSortCriteria(
  sortBy: string | undefined
): Record<string, SortOrder> {
  switch (sortBy) {
    case "date":
      return { date: 1 };
    case "name":
      return { name: 1 };
    case "price":
      return { price: 1 };
    case "popularity":
      return { bookedSeats: -1 };
    default:
      return { createdAt: -1 };
  }
}
