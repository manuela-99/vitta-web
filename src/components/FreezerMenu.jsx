import { freezerMenu } from '../data/siteContent';
import { getProductsForDish } from '../data/catalog';
import MenuDishRow from './cart/MenuDishRow';

function FreezerCategoryBlock({ category }) {
  return (
    <article className="menu-category-block">
      <h3 className="menu-category-block__name menu-category">{category.name}</h3>
      <div className="menu-category-block__rule" aria-hidden="true" />
      {category.price && (
        <div className="menu-category-block__prices menu-price">{category.price}</div>
      )}
      {category.items && (
        <ul className="menu-category-block__items menu-category-block__items--cart">
          {category.items.map((item) => {
            const dishName = typeof item === 'string' ? item : item.label;
            const products = getProductsForDish('freezer', category.name, dishName);
            return <MenuDishRow key={dishName} name={dishName} products={products} dark />;
          })}
        </ul>
      )}
    </article>
  );
}

export default function FreezerMenu() {
  const columnByName = Object.fromEntries(freezerMenu.columns.map((column) => [column.name, column]));

  const categories = [
    columnByName.EMPANADAS,
    columnByName.MILANESAS,
    columnByName.PASTAS,
    columnByName.SALSAS,
  ];

  return (
    <section className="menu-section menu-section--dark" aria-label="Menú Freezer Ready">
      <div className="menu-section__inner">
        <h2 className="menu-section__title script-title">{freezerMenu.title}</h2>
        <div className="menu-paired-grid">
          {categories.map((category) => (
            <div key={category.name} className="menu-paired-grid__cell">
              <FreezerCategoryBlock category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
