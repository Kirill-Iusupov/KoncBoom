import { items } from "@/src/shared/mock/data";
import PromCard from "@/src/features/promCard";
import { MainPageButton } from "@/src/shared/ui/MainPageButton";
import { promotionItems } from "@/src/shared/api/api";

const PromsOnMain = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[24px] font-bold text-black">Акции</h3>
          <p>Актуальные предложения — только ограниченное время</p>
        </div>
        <MainPageButton title="Смотреть все акции" url="promotions" />
      </div>
      <div className="flex flex-wrap gap-5">
        {promotionItems.map((item, idx) => (
          <div key={idx}>
            <PromCard />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromsOnMain;
