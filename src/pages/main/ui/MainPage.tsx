import { CatergoriesOnMain as Categories } from "@/src/widgets/categoriesOnMain";
import { MainPageInfo as Info } from "@/src/widgets/mainPageInfo";
import Popular from "@/src/widgets/popular";
import { PromsOnMain as Promotions } from "@/src/widgets/promsOnMain";

export const MainPage = () => {
  return (
    <div className="flex flex-col gap-10!">
      <Info />
      <Promotions />
      <Categories />
      <Popular />
    </div>
  );
};
