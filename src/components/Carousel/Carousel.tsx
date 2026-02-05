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
const CLONES = 1;

export function Carousel({ products }: Props) {
  const baseItems = useMemo(() => pickRandom(products, MAX_ITEMS), [products]);

  const items = useMemo(() => {
    if (baseItems.length === 0) return [];
    return [
      ...baseItems.slice(-CLONES),
      ...baseItems,
      ...baseItems.slice(0, CLONES),
    ];
  }, [baseItems]);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(CLONES);
  const [slideWidth, setSlideWidth] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useLayoutEffect(() => {
    if (!trackRef.current) return;

    const slide = trackRef.current.children[0] as HTMLElement | undefined;
    if (!slide) return;

    setSlideWidth(slide.clientWidth);
  }, [items.length]);

  useLayoutEffect(() => {
    if (!viewportRef.current || !trackRef.current) return;

    const observer = new ResizeObserver(() => {
      const slide = trackRef.current!.children[0] as HTMLElement | undefined;
      if (!slide) return;

      setSlideWidth(slide.clientWidth);
    });

    observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, []);

  const next = useCallback(() => {
    setIndex((i) => i + 1);
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => i - 1);
  }, []);

  const swipeHandlers = useSwipe(next, prev);

  const handleTransitionEnd = () => {
    if (index === 0) {
      setIsAnimating(false);
      setIndex(baseItems.length);
      return;
    }

    if (index === baseItems.length + CLONES) {
      setIsAnimating(false);
      setIndex(CLONES);
    }
  };

  useLayoutEffect(() => {
    if (!isAnimating) {
      requestAnimationFrame(() => setIsAnimating(true));
    }
  }, [isAnimating]);

  const offset = index * slideWidth;

  if (!items.length) return null;

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
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(-${offset}px)`,
              transition: isAnimating ? "transform 0.3s ease" : "none",
            }}
          >
            {items.map((product, i) => (
              <div key={`${product.id}-${i}`} className={styles.slide}>
                <ProductCardCarousel product={product} />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={`${styles.navButton} ${styles.prev}`}
          onClick={prev}
          aria-label="Předchozí produkt"
        >
          ←
        </button>

        <button
          type="button"
          className={`${styles.navButton} ${styles.next}`}
          onClick={next}
          aria-label="Další produkt"
        >
          →
        </button>
      </div>
    </section>
  );
}
