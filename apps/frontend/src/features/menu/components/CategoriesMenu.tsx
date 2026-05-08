import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchClient } from "@/lib/fetchClient";
import type { CategoryDto } from "@/lib/types/category";
import CategoryProductsSection from "./CategoryProductsSection";

const CategoriesMenu = async () => {
  const { data: categories } = await fetchClient<CategoryDto[]>(
    "/api/v1/category"
  );

  return (
    <Tabs
      className="text-primary flex flex-col items-center"
      defaultValue="all"
    >
      <TabsList className="bg-card shadow-2xl shadow-black">
        <TabsTrigger
          value={"all"}
          className="text-primary data-[state=active]:text-primary-foreground data-[state=active]:bg-primary cursor-pointer"
        >
          All
        </TabsTrigger>
        {categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.name}
            className="text-primary data-[state=active]:text-primary-foreground data-[state=active]:bg-primary cursor-pointer"
          >
            {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="all" className="grid">
        <CategoryProductsSection />
      </TabsContent>
      {categories.map((category) => (
        <TabsContent key={category.id} value={category.name}>
          <CategoryProductsSection categoryId={category.id} />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default CategoriesMenu;
