"use client";

import { usePathname } from "next/navigation";
import { Wrapper } from "../../../shared/ui/Wrapper";
import { heading_items } from "../model/heading.mock";
import heading from '@/src/shared/imgs/heading.webp'

const Heading = () => {
  const pathname = usePathname();
  const currentHeading = heading_items.find((e) => e.link === pathname);
  if (!currentHeading) return null;
// bg-[linear-gradient(90deg,_#5F72BD_0%,_#9B23EA_100%)]
  return (
    <div className="w-full   text-white  bg-cover bg-center"
    style={{ backgroundImage: `url(${heading.src})`}}
    >
    <div className="h-full py-[40px]  backdrop-filter-[blur(3px)]">
      <Wrapper>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
          <div className={currentHeading.stats ? "lg:max-w-[60%]" : "w-full"}>
            {currentHeading.main_info && (
              <h3 className="text-white [text-shadow:0px_0px_10px_#838383] uppercase font-semibold text-sm tracking-wider mb-2">
                {currentHeading.main_info}
              </h3>
            )}
            <h2 className="text-[64px] md:text-[96px] font-semibold leading-tight [text-shadow:0px_0px_10px_#838383]">
              {currentHeading.title}
            </h2>
            {currentHeading.extra_info && (
              <p className="font-medium  text-base md:text-lg leading-relaxed  [text-shadow:0px_0px_10px_#838383]">
                {currentHeading.extra_info}
              </p>
            )}
          </div>

          {currentHeading.stats && (
            <div className="grid grid-cols-2 gap-4 min-w-[320px] md:min-w-[400px]">
              {currentHeading.stats.map((stat, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${stat.bgClass} backdrop-blur-sm rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-lg aspect-square`}
                >
                  <span className="text-[32px] md:text-[40px] font-bold text-slate-800 leading-none mb-2">
                    {stat.value}
                  </span>
                  <span className="text-xs md:text-sm font-semibold text-slate-600 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Wrapper>
        </div>
    </div>
  );
};

export default Heading;
