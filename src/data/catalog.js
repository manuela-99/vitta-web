import { freezerMenu, viandasMenu } from './siteContent';
import { formatPrice, parsePriceFromDisplay } from '../utils/price';

function slug(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const VIANDAS_PRESENTATIONS = {
  CARNES: {
    panelLabel: 'Elegí el tamaño',
    variants: [
      { key: '250g', label: '250 g', grams: 250, priceIndex: 0 },
      { key: '500g', label: '500 g', grams: 500, priceIndex: 1 },
    ],
  },
  POLLOS: {
    panelLabel: 'Elegí el tamaño',
    variants: [
      { key: '250g', label: '250 g', grams: 250, priceIndex: 0 },
      { key: '500g', label: '500 g', grams: 500, priceIndex: 1 },
    ],
  },
  CERDOS: {
    panelLabel: 'Elegí el tamaño',
    variants: [
      { key: '250g', label: '250 g', grams: 250, priceIndex: 0 },
      { key: '500g', label: '500 g', grams: 500, priceIndex: 1 },
    ],
  },
  PESCADOS: {
    panelLabel: 'Elegí el tamaño',
    variants: [
      { key: '250g', label: '250 g', grams: 250, priceIndex: 0 },
      { key: '500g', label: '500 g', grams: 500, priceIndex: 1 },
    ],
  },
  'TARTAS & QUICHES': {
    panelLabel: 'Elegí el tamaño',
    variants: [
      { key: '4p', label: '4 porciones', portions: 4, priceIndex: 0 },
      { key: '8p', label: '8 porciones', portions: 8, priceIndex: 1 },
    ],
  },
  SOPAS: {
    panelLabel: 'Elegí el tamaño',
    variants: [
      { key: 'individual', label: 'Individual', priceIndex: 0 },
      { key: 'familiar', label: 'Familiar', priceIndex: 1 },
    ],
  },
  GUARNICIONES: {
    panelLabel: 'Elegí el tamaño',
    variants: [
      { key: 'individual', label: 'Individual', priceIndex: 0 },
      { key: '2-3', label: '2-3 personas', priceIndex: 1 },
    ],
  },
  ENSALADAS: {
    panelLabel: null,
    variants: [{ key: 'individual', label: 'Individual abundante', priceIndex: 0 }],
  },
};

const FREEZER_PREPARATION_MODE = {
  EMPANADAS: 'sin-tacc-only',
  MILANESAS: 'sin-tacc-only',
  PASTAS: 'con-tacc-only',
  SALSAS: 'choice',
};

function getPreparationMode(section, categoryName) {
  if (section === 'viandas') return 'choice';
  return FREEZER_PREPARATION_MODE[categoryName] ?? 'choice';
}

function buildViandasProducts(category) {
  const config = VIANDAS_PRESENTATIONS[category.name];
  if (!config) return [];

  const itemNames = category.items.map((item) => (typeof item === 'string' ? item : item.name));

  return itemNames.flatMap((itemName) =>
    config.variants.map((variant) => {
      const unitPrice = parsePriceFromDisplay(category.prices[variant.priceIndex]);
      return {
        id: `viandas-${slug(category.name)}-${slug(itemName)}-${variant.key}`,
        section: 'viandas',
        category: category.name,
        name: itemName,
        presentationKey: variant.key,
        presentationLabel: variant.label,
        unitPrice,
        unitPriceLabel: formatPrice(unitPrice),
        gramsPerUnit: variant.grams ?? null,
        portionsPerUnit: variant.portions ?? null,
        panelLabel: config.panelLabel,
        preparationMode: getPreparationMode('viandas', category.name),
      };
    }),
  );
}

function buildFreezerFlavorProducts(categoryName, categoryId, itemNames, presentation, unitPrice, minQuantity = 1) {
  return itemNames.map((name) => ({
    id: `freezer-${categoryId}-${slug(name)}`,
    section: 'freezer',
    category: categoryName,
    name,
    presentationKey: presentation.key,
    presentationLabel: presentation.label,
    unitPrice,
    unitPriceLabel: formatPrice(unitPrice),
    panelLabel: null,
    minQuantity,
    quantityUnit: presentation.quantityUnit,
    preparationMode: getPreparationMode('freezer', categoryName),
  }));
}

function buildFreezerProducts() {
  const products = [];

  freezerMenu.columns.forEach((column) => {
    const categoryId = slug(column.name);

    if (column.name === 'MILANESAS') {
      column.items.forEach((item) => {
        const unitPrice = parsePriceFromDisplay(item.price);
        products.push({
          id: `freezer-milanesas-${slug(item.label)}`,
          section: 'freezer',
          category: column.name,
          name: item.label,
          presentationKey: '1kg',
          presentationLabel: '1 kg',
          unitPrice,
          unitPriceLabel: formatPrice(unitPrice),
          panelLabel: null,
          minQuantity: 1,
          quantityUnit: 'kg',
          gramsPerUnit: 1000,
          preparationMode: getPreparationMode('freezer', column.name),
        });
      });
      return;
    }

    const unitPrice = parsePriceFromDisplay(column.price);
    const presentation = {
      key: categoryId,
      label: column.price.split(' · ').slice(1).join(' · ') || column.price,
      quantityUnit:
        column.name === 'EMPANADAS' ? 'docena' : column.name === 'PASTAS' ? 'caja' : 'unidad',
    };

    products.push(
      ...buildFreezerFlavorProducts(
        column.name,
        categoryId,
        column.items,
        presentation,
        unitPrice,
        1,
      ),
    );
  });

  return products;
}

const viandasCategories = [...viandasMenu.primaryCategories, ...viandasMenu.wideCategories];
const viandasProducts = viandasCategories.flatMap(buildViandasProducts);
const freezerProducts = buildFreezerProducts();

export const catalogProducts = [...viandasProducts, ...freezerProducts];

export const catalogProductMap = Object.fromEntries(catalogProducts.map((product) => [product.id, product]));

export function getCatalogProduct(productId) {
  return catalogProductMap[productId];
}

export function getProductsForDish(section, categoryName, dishName) {
  return catalogProducts.filter(
    (product) =>
      product.section === section && product.category === categoryName && product.name === dishName,
  );
}

export function groupProductsByDish(products) {
  const groups = new Map();

  products.forEach((product) => {
    if (!groups.has(product.name)) {
      groups.set(product.name, []);
    }
    groups.get(product.name).push(product);
  });

  return groups;
}

export function getCategoryProducts(category, section = 'viandas') {
  if (section === 'viandas') {
    return buildViandasProducts(category);
  }
  return [];
}
