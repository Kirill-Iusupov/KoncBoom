import { MainPageButton } from "@/src/shared/ui/MainPageButton";
import { promotionItems } from "@/src/shared/api/api";
import { PromCard } from "@/src/features/promCard/ui/PromCard";

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
      <div className="flex flex-wrap gap-5 mt-10">
        {promotionItems.slice(0, 4).map((item, idx) => (
          <PromCard
            key={idx}
            eyebrow={item.promoInfo?.eyebrow}
            title={item.promoInfo?.title}
            description="При покупке от 10 штук любых ручек Pilot или Stabilo"
            discount={item.promoInfo?.discount}
          />
        ))}
      </div>
    </div>
  );
};

export default PromsOnMain;
