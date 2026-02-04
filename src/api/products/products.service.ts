import { post } from "../http";
import { mapAlzaProductToCard } from "./products.mapper";
import type { AlzaProductsResponse, ProductCard } from "./products.types";

export type GetProductsParams = {
  categoryId: number;
  page?: number;
};

/* 🔽 ВОТ ЗДЕСЬ */
const USE_MOCK = true;
/* 🔼 ВОТ ЗДЕСЬ */

export async function getProductCards(
  params: GetProductsParams,
): Promise<ProductCard[]> {
 if (USE_MOCK) {
  const { getProductCardsMock } = await import("./products.mock.service");
  return getProductCardsMock();
}

  const response = await post<AlzaProductsResponse>(
    "/alza-api/Services/RestService.svc/v2/products",
    {
      filter: {
        categoryId: params.categoryId,
        page: params.page ?? 1,
      },
    },
  );

  return response.data.map(mapAlzaProductToCard);
}
