import { getCategoryProducts, groupProductsByDish } from '../data/catalog';
import MenuDishRow from './cart/MenuDishRow';

export default function MenuCategoryBlock({ category, hideCategoryPrices = false }) {
  const salads = category.items?.[0]?.ingredients != null;
  const products = getCategoryProducts(category);
  const dishGroups = groupProductsByDish(products);
  const dishLayout = hideCategoryPrices ? 'viandas' : 'default';

  return (
    <article
      className={`menu-category-block${
        hideCategoryPrices ? ' menu-category-block--compact' : ''
      }`}
    >
      <h3 className="menu-category-block__name menu-category">{category.name}</h3>
      <div className="menu-category-block__rule" aria-hidden="true" />

      {!hideCategoryPrices && (
        <div className="menu-category-block__prices menu-price">
          {category.prices.map((price) => (
            <p key={price} className="menu-category-block__price-line">
              {price}
            </p>
          ))}
        </div>
      )}

      {category.note && <p className="menu-category-block__note">{category.note}</p>}

      {salads ? (
        <div className="menu-category-block__items menu-category-block__items--salads">
          {category.items.map((salad) => (
            <div key={salad.name} className="menu-salad-item">
              <ul className="menu-category-block__items menu-category-block__items--cart">
                <MenuDishRow
                  name={salad.name}
                  products={dishGroups.get(salad.name) ?? []}
                  layout={dishLayout}
                />
              </ul>
              <p className="menu-salad-item__ingredients menu-item-desc">{salad.ingredients}</p>
            </div>
          ))}
        </div>
      ) : (
        <ul className="menu-category-block__items menu-category-block__items--cart">
          {category.items.map((item) => {
            const dishName = typeof item === 'string' ? item : item.name;
            return (
              <MenuDishRow
                key={dishName}
                name={dishName}
                products={dishGroups.get(dishName) ?? []}
                layout={dishLayout}
              />
            );
          })}
        </ul>
      )}
    </article>
  );
}
