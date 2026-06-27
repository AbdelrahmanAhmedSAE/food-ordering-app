import { CategoriesMenu } from "@/features/menu/components/CategoriesMenu";

const MenuPage = () => {
  return (
    <main className="mt-24 flex flex-col items-center gap-8 px-4 pb-20">
      <h1 className="text-5xl font-black text-primary text-center">Menu</h1>
      <CategoriesMenu />
    </main>
  );
};

export default MenuPage;
