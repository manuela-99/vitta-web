import MenuCategoryBlock from './MenuCategoryBlock';
import { viandasMenu } from '../data/siteContent';

export default function ViandasMenu() {
  const { title, primaryCategories, wideCategories } = viandasMenu;

  const categories = [
    primaryCategories[0],
    primaryCategories[1],
    primaryCategories[2],
    primaryCategories[3],
    primaryCategories[4],
    primaryCategories[5],
    wideCategories[0],
    wideCategories[1],
  ];

  return (
    <section className="menu-section viandas-menu" aria-label="Menú de viandas">
      <div className="menu-section__inner">
        <h2 className="menu-section__title script-title">{title}</h2>

        <div className="menu-paired-grid">
          {categories.map((category) => (
            <div key={category.name} className="menu-paired-grid__cell">
              <MenuCategoryBlock category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
