import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryProductsSection } from "./CategoryProductsSection";
import { categoryService } from "../services/categoryService";
import type { CategorySummery } from "@repo/shared";

export const CategoriesMenu = async () => {
  const { data } = await categoryService.getCategories();

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
        {data.map((category: CategorySummery) => (
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
      {data.map((category: CategorySummery) => (
        <TabsContent key={category.id} value={category.name}>
          <CategoryProductsSection categoryId={category.id} />
        </TabsContent>
      ))}
    </Tabs>
  );
};
