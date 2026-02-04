import type { ProductCard } from "./products.types";
import { mockProductCards } from "./products.mock.data";

export async function getProductCardsMock(): Promise<ProductCard[]> {
  await new Promise((r) => setTimeout(r, 300));
  return mockProductCards;
}
