import { MainPageInfoBlock as Info } from "@/src/features/mainPageInfoBlock";
import { MainPageButton as Button } from "@/src/shared/ui/MainPageButton";

const MainPageInfo = () => {
  return (
    <div className="flex flex-col gap-5 items-start text-center pt-10!">
      <p className="uppercase!">канцелярский магазин бишкек</p>
      <h1 className="text-[96px] font-semibold letter-spacing-[2%] text-[#1E2D42]">
        Всё для творчества и работы
      </h1>
      <p>
        Ручки, карандаши, блокноты, папки и всё, что нужно школьникам, студентам
        и офисным работникам.
      </p>
      <div className="flex gap-50 my-20">
        <Button url="promotions" title="Акции" color="F59E0B" bColor="D97706" />
        <Button url="categories" title="Все категории" />
      </div>
      <Info />
    </div>
  );
};

export default MainPageInfo;
