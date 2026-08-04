import { MainPageInfoBlock as Info } from "@/src/features/mainPageInfoBlock";
import { MainPageButton as Button } from "@/src/shared/ui/MainPageButton";

const MainPageInfo = () => {
  return (
    <div className="w-[calc(100%+40px)] mx-[-20px] md:w-[calc(100%+160px)] md:mx-[-80px]">
      <div className="relative overflow-hidden bg-[linear-gradient(125deg,#10192A_0%,#1E2D42_55%,#2C4266_100%)] px-5! md:px-20! pt-14! pb-28! md:pt-20! md:pb-36!">
        {/* decorative accent glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-orange/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-brand-blue/20 blur-3xl" />

        <div className="relative flex flex-col gap-5 items-start max-w-3xl">
          <p className="uppercase! text-white/70 text-xs! font-semibold tracking-[0.08em]!">
            Канцелярский магазин · Бишкек
          </p>
          <h1 className="text-[40px] md:text-[72px] leading-[1.05]! font-extrabold text-white">
            Всё для творчества и работы
          </h1>
          <p className="text-white/75 text-base md:text-lg max-w-lg">
            Ручки, карандаши, блокноты, папки и всё, что нужно школьникам, студентам
            и офисным работникам.
          </p>
          <div className="flex flex-wrap gap-4 mt-4!">
            <Button url="promotions" title="Смотреть акции" color="F59E0B" bColor="D97706" />
            <Button url="categories" title="Все категории" dark />
          </div>
        </div>
      </div>

      {/* floating stats card, bridging hero and page content */}
      <div className="relative px-5! md:px-20! -mt-14! md:-mt-16!">
        <Info />
      </div>
    </div>
  );
};

export default MainPageInfo;
