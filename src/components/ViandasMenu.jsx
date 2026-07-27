import MenuCategoryBlock from './MenuCategoryBlock';
import { viandasMenu } from '../data/siteContent';
import Reveal from './Reveal';

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
        <Reveal as="h2" className="menu-section__title script-title" delay={0}>
          {title}
        </Reveal>

        <Reveal className="menu-paired-grid" delay={100}>
          {categories.map((category) => (
            <div key={category.name} className="menu-paired-grid__cell">
              <MenuCategoryBlock category={category} hideCategoryPrices />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
