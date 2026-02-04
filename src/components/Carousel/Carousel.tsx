import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ProductCard as Product } from "../../api/products/products.types";
import { ProductCardCarousel } from "./ProductCardCarousel";
import { pickRandom } from "../../utils/pickRandom";
import { useSwipe } from "./useSwipe";
import styles from "./Carousel.module.css";

interface Props {
  products: Product[];
}

const MAX_ITEMS = 10;

export function Carousel({ products }: Props) {
  const items = useMemo(() => pickRandom(products, MAX_ITEMS), [products]);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);

  useLayoutEffect(() => {
    if (!viewportRef.current || !trackRef.current) return;

    const viewportWidth = viewportRef.current.clientWidth;
    const slide = trackRef.current.children[0] as HTMLElement | undefined;
    if (!slide) return;

    const width = slide.clientWidth;

    setSlideWidth(width);
    setVisibleCount(Math.floor(viewportWidth / width));
  }, [items.length]);

  useLayoutEffect(() => {
    if (!viewportRef.current || !trackRef.current) return;

    const observer = new ResizeObserver(() => {
      const slide = trackRef.current!.children[0] as HTMLElement | undefined;
      if (!slide) return;

      const viewportWidth = viewportRef.current!.clientWidth;
      const width = slide.clientWidth;

      setSlideWidth(width);
      setVisibleCount(Math.floor(viewportWidth / width));
    });

    observer.observe(viewportRef.current);

    return () => observer.disconnect();
  }, []);

  const maxIndex = Math.max(0, items.length - visibleCount);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const next = useCallback(() => {
    setIndex((i) => Math.min(maxIndex, i + 1));
  }, [maxIndex]);

  const swipeHandlers = useSwipe(next, prev);

  const offset = index * slideWidth;

  if (!items.length) {
    return null;
  }

  return (
    <section className={styles.carousel}>
      <header className={styles.header}>
        <h2>Nejprodávanější</h2>
      </header>

      <div className={styles.carouselWrapper}>
        <div className={styles.viewport} ref={viewportRef} {...swipeHandlers}>
          <div
            className={styles.track}
            ref={trackRef}
            style={{
              transform: `translateX(-${offset}px)`,
            }}
          >
            {items.map((product) => (
              <div key={product.id} className={styles.slide}>
                <ProductCardCarousel product={product} />
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          className={`${styles.navButton} ${styles.prev}`}
          onClick={prev}
          disabled={index === 0}
          aria-label="Předchozí produkt"
        >
          ←
        </button>
        <button
          type="button"
          className={`${styles.navButton} ${styles.next}`}
          onClick={next}
          disabled={index === maxIndex}
          aria-label="Další produkt"
        >
          →
        </button>
      </div>
    </section>
  );
}
