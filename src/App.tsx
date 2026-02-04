import { useState } from "react";
import "./styles/layout.css";
import { useProducts } from "./hooks/useProducts";
import { CategoriesSection } from "./components/Categories/CategoriesSection";
import { Carousel } from "./components/Carousel/Carousel";
import { ProductsSection } from "./components/ProductsSection/ProductsSection";
import "./styles/layout.css";

export function App() {
  const [page, setPage] = useState(1);


  const carouselQuery = useProducts(1);

  const sectionQuery = useProducts(page);

  return (
    <main className="layout">
      <h1 className="pageTitle">Notebooky</h1>

      <CategoriesSection />

      {!carouselQuery.loading && !carouselQuery.error && (
        <Carousel products={carouselQuery.products} />
      )}

      <ProductsSection
        products={sectionQuery.products}
        page={page}
        loading={sectionQuery.loading}
        error={sectionQuery.error}
        onPageChange={setPage}
      />
    </main>
  );
}
