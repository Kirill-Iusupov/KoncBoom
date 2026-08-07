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
    <div className="w-full relative text-white bg-cover bg-center"
    style={{ backgroundImage: `url(${heading.src})`}}
    >
    <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(16,25,42,0.92)_0%,rgba(30,45,66,0.85)_45%,rgba(30,45,66,0.55)_100%)]" />
    <div className="relative h-full py-[48px] md:py-[64px]">
      <Wrapper>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
          <div className={currentHeading.stats ? "lg:max-w-[58%]" : "w-full"}>
            {currentHeading.main_info && (
              <h3 className="text-brand-orange uppercase font-semibold text-xs tracking-[0.08em] mb-3">
                {currentHeading.main_info}
              </h3>
            )}
            <h2 className="text-[42px] md:text-[64px] font-extrabold leading-[1.05]">
              {currentHeading.title}
            </h2>
            {currentHeading.extra_info && (
              <p className="font-normal text-white/75 text-base md:text-lg leading-relaxed mt-4 max-w-xl">
                {currentHeading.extra_info}
              </p>
            )}
          </div>

          {currentHeading.stats && (
            <div className="grid grid-cols-2 gap-4 min-w-[300px] md:min-w-[380px]">
              {currentHeading.stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/95 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-xl aspect-square"
                >
                  <span className="font-num text-[28px] md:text-[34px] font-semibold text-brand-ink leading-none mb-2">
                    {stat.value}
                  </span>
                  <span className="text-xs md:text-sm font-semibold text-brand-muted uppercase tracking-wider">
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
