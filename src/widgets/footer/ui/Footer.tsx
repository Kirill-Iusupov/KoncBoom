import React from "react";
import { Wrapper } from "../../../shared/ui/Wrapper";
import { footer_items } from "../model/footer.mock";

export const Footer = () => {
  return (
    <div className="bg-[#B6CFF9] py-12 text-[#000000]">
      <Wrapper>
        {footer_items ? (
          <footer className="flex gap-[200px] items-center pt-[20px] pb-[95px] ">
            <div className="md:h-[368px] flex  flex-col justify-between gap-6">
              <div>
                {footer_items.logo && <div>{footer_items.logo}</div>}

                {footer_items.description && (
                  <p dangerouslySetInnerHTML={{ __html:footer_items.description}} className="text-[18px] pt-[10px] text-[18px] max-w-sm leading-relaxed ">
                  </p>
                )}
              </div>

              {footer_items.navItems[0] && (
                <div className="mt-4">
                  <h3 className="font-bold text-[20px] mb-[13px]">
                    {footer_items.navItems[0].title}
                  </h3>
                  <ul className="flex flex-col gap-[13px]">
                    {footer_items.navItems[0].list.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-[18px]"
                        dangerouslySetInnerHTML={{ __html: item.titleHtml }}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {footer_items.navItems.slice(1).map((navGroup, groupIdx) => (
              <div key={groupIdx} className="flex flex-col gap-4 md:pl-8">
                <h3 className="font-bold text-[20px]">{navGroup.title}</h3>
                <ul className="flex flex-col gap-2.5">
                  {navGroup.list.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <a
                        href={item.link || "#"}
                        className="text-[18px] hover:underline block transition-all"
                        dangerouslySetInnerHTML={{ __html: item.titleHtml }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </footer>
        ) : null}
      </Wrapper>
    </div>
  );
};
