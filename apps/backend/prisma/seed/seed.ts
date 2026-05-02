import seedCategories from './seedCategories';
import { seedExtras } from './seedExtras';
import { seedImages } from './seedProductImages';
import { seedProducts } from './seedProducts';
import SeedProductVariants from './seedProductVariants';

async function main() {
  const categories = await seedCategories();

  // Pizza
  const pizzaProducts = await seedProducts(
    categories,
    'Pizza',
    [
      'Margherita',
      'BBQ Chicken',
      'Pepperoni',
      'Hawaiian',
      'Veggie Delight',
      'Four Cheese',
      'Meat Lovers',
      'Spicy Italian',
      'Seafood Special',
      'Mushroom Classic',
    ],
    'Delicious pizza',
  );
  await seedExtras(pizzaProducts, [
    { name: 'Extra Cheese', price: 20 },
    { name: 'Extra Sauce', price: 10 },
    { name: 'Bacon', price: 30 },
  ]);
  await seedImages(pizzaProducts, [
    '/pizza1.jpg',
    '/pizza2.jpg',
    '/pizza3.jpg',
  ]);

  // Burger
  const burgerProducts = await seedProducts(
    categories,
    'Burger',
    [
      'Classic Burger',
      'Cheese Burger',
      'Bacon Burger',
      'Veggie Burger',
      'Double Beef',
    ],
    'Juicy burgers',
  );
  await seedExtras(burgerProducts, [
    { name: 'Extra Cheese', price: 15 },
    { name: 'Bacon', price: 25 },
    { name: 'Onion Rings', price: 10 },
  ]);
  await seedImages(burgerProducts, [
    '/burger1.jpg',
    '/burger2.jpg',
    '/burger3.jpg',
    '/burger4.jpg',
  ]);

  // Sandwich
  const sandwichProducts = await seedProducts(
    categories,
    'Sandwich',
    ['Chicken Sandwich', 'Veggie Sandwich', 'Club Sandwich'],
    'Tasty sandwiches',
  );
  await seedExtras(sandwichProducts, [
    { name: 'Extra Cheese', price: 10 },
    { name: 'Extra Sauce', price: 5 },
  ]);
  await seedImages(sandwichProducts, [
    '/sandwich1.jpg',
    '/sandwich2.jpg',
    '/sandwich3.jpg',
  ]);

  // Drinks
  const drinkProducts = await seedProducts(
    categories,
    'Drinks',
    ['Coke', 'Pepsi', 'Fanta'],
    'Refreshing drinks',
  );
  await seedExtras(drinkProducts, [
    { name: 'Ice', price: 0 },
    { name: 'Lemon', price: 5 },
  ]);
  await seedImages(drinkProducts, [
    '/drink-1.jpg',
    '/drink-2.jpg',
    '/drink-3.jpg',
  ]);

  // Desserts
  const dessertProducts = await seedProducts(
    categories,
    'Desserts',
    ['Chocolate Cake', 'Ice Cream', 'Brownie'],
    'Sweet desserts',
  );
  await seedExtras(dessertProducts, [
    { name: 'Extra Chocolate', price: 10 },
    { name: 'Cherry', price: 5 },
  ]);
  await seedImages(dessertProducts, ['/dessert-1.jpg', '/dessert-2.jpg']);

  await SeedProductVariants(pizzaProducts);
  await SeedProductVariants(burgerProducts);
  await SeedProductVariants(sandwichProducts);
  await SeedProductVariants(drinkProducts);
  await SeedProductVariants(dessertProducts);
}

void main();
