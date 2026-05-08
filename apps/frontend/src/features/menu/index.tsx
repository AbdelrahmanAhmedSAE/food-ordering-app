import CategoriesMenu from "./components/CategoriesMenu";

const ProductsMenu = () => (
  <main className="mt-20 flex flex-col items-center gap-5">
    <h1 className="text-4xl font-bold text-primary text-center">Menu</h1>
    <CategoriesMenu />
  </main>
);

export default ProductsMenu;
