import { useEffect, useRef, useState } from "react";
import type { ProductCard as Product } from "../../api/products/products.types";
import styles from "./ProductCard.module.css";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const buyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (buyRef.current && !buyRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [menuOpen]);

  return (
    <article className={styles.card}>
      <a href={product.productUrl} className={styles.imageWrapper}>
        <img src={product.imageUrl} alt={product.title} loading="lazy" />
      </a>

      <div className={styles.content}>
        <a href={product.productUrl} className={styles.title}>
          {product.title}
        </a>

        <p className={styles.description}>{product.description}</p>

        <div className={styles.bottomRow}>
          <div className={styles.priceBlock}>
            <span className={styles.price}>
              {product.price.toLocaleString("cs-CZ")} Kč
            </span>

            {product.oldPrice != null && (
              <span className={styles.oldPrice}>
                {product.oldPrice.toLocaleString("cs-CZ")} Kč
              </span>
            )}
          </div>

          <div ref={buyRef} className={styles.buy}>
            <button
              type="button"
              className={styles.buyButton}
              onClick={() => setMenuOpen((v) => !v)}
            >
              Koupit ▾
            </button>

            {menuOpen && (
              <ul className={styles.buyMenu}>
                <li>Koupit rychle</li>
                <li>Srovnat</li>
                <li>Sledovat</li>
                <li>Přidat do seznamu</li>
              </ul>
            )}
          </div>
        </div>

        <div className={styles.availability}>{product.availability}</div>
      </div>
    </article>
  );
}
