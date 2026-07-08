import Link from "next/link";
import { items } from "@/src/shared/mock/data";
import PromCard from "@/src/features/promCard";

const PromsOnMain = () => {
  const filteredItems = items.filter((item) => item.prom);
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[24px] font-bold text-black">Акции</h3>
          <p>Актуальные предложения — только ограниченное время</p>
        </div>
        <button className="bg-[#F5F5F5] text-black py-2 px-4 rounded border-[1px_1px_4px_1px] border-[#1E2D42] p-4 cursor-pointer">
          <Link href={"/promotions"}> Смотреть все акции</Link>
        </button>
      </div>
      <div className="flex flex-wrap gap-5">
        {filteredItems.map((item, idx) => (
          <div key={idx}>
            <PromCard />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromsOnMain;
