"use client";

import { usePathname } from "next/navigation";
import { Wrapper } from "../../header/ui/Wrapper";
import { heading_items } from "../model/heading.mock";

const Heading = () => {
  const router = usePathname();
  const heading = heading_items.filter((e) => e.link === router);
  const [link] = heading;
  console.log(link);

  return (
    <>
      {link ? (
        <div className="w-full py-[40px]  bg-[linear-gradient(90deg,_#5F72BD_0%,_#9B23EA_100%)]">
          <Wrapper>
            <h3 className="text-[#D10000] uppercase font-semibold">
              {link.main_info}
            </h3>
            <h2 className="text-[96px] text-white font-semibold">
              {link.title}
            </h2>
            <p className="md:w-[50%] font-semibold text-[#CCCCCC]">
              {link.extra_info}
            </p>
          </Wrapper>
        </div>
      ) : null}
    </>
  );
};

export default Heading;
