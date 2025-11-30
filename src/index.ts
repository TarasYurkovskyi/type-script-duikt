// === Крок 1: Типи товарів ===

// Базовий тип товару
type BaseProduct = {
  id: number;
  name: string;
  price: number;
  description?: string; // додаткове поле
};

// Тип для електроніки
type Electronics = BaseProduct & {
  category: 'electronics';
  warrantyMonths: number; // термін гарантії
};

// Тип для одягу
type Clothing = BaseProduct & {
  category: 'clothing';
  size: 'S' | 'M' | 'L' | 'XL';
  material: string;
};

// Тип для книг
type Book = BaseProduct & {
  category: 'book';
  author: string;
  pages: number;
};

// === Крок 2: Функції для пошуку товарів ===

/**
 * Знаходить товар за ID
 */
const findProduct = <T extends BaseProduct>(products: T[], id: number): T | undefined => {
  return products.find(p => p.id === id);
};

/**
 * Фільтрує товари за максимальною ціною
 */
const filterByPrice = <T extends BaseProduct>(products: T[], maxPrice: number): T[] => {
  return products.filter(p => p.price <= maxPrice);
};

// === Крок 3: Кошик ===

// Елемент кошика
type CartItem<T extends BaseProduct> = {
  product: T;
  quantity: number;
};

/**
 * Додає товар у кошик
 */
const addToCart = <T extends BaseProduct>(
  cart: CartItem<T>[],
  product: T | undefined,
  quantity: number
): CartItem<T>[] => {
  if (!product || quantity <= 0) return cart;

  const existing = cart.find(item => item.product.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }

  return cart;
};

/**
 * Обчислює загальну вартість кошика
 */
const calculateTotal = <T extends BaseProduct>(cart: CartItem<T>[]): number => {
  return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
};

// === Крок 4: Тестові дані та використання ===

const electronics: Electronics[] = [
  { id: 1, name: "Телефон", price: 10000, category: 'electronics', warrantyMonths: 24 },
  { id: 2, name: "Ноутбук", price: 25000, category: 'electronics', warrantyMonths: 12 }
];

const clothes: Clothing[] = [
  { id: 3, name: "Футболка", price: 500, category: 'clothing', size: 'M', material: "Cotton" },
  { id: 4, name: "Джинси", price: 1500, category: 'clothing', size: 'L', material: "Denim" }
];

const books: Book[] = [
  { id: 5, name: "TypeScript Handbook", price: 800, category: 'book', author: "TS Team", pages: 400 },
  { id: 6, name: "Clean Code", price: 1200, category: 'book', author: "Robert C. Martin", pages: 464 }
];

// Приклади використання
const phone = findProduct(electronics, 1);
const cheapBooks = filterByPrice(books, 1000);

let cart: CartItem<BaseProduct>[] = [];
cart = addToCart(cart, phone, 1);
cart = addToCart(cart, cheapBooks[0], 2);

console.log("Кошик:", cart);
console.log("Загальна вартість:", calculateTotal(cart));
