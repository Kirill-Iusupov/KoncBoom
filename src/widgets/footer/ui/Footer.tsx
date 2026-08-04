import React from "react";
import { Wrapper } from "../../../shared/ui/Wrapper";
import { footer_items } from "../model/footer.mock";

export const Footer = () => {
  return (
    <div className="bg-[linear-gradient(120deg,#10192A,#1E2D42_70%)] py-12 text-white mt-16!">
      <Wrapper>
        {footer_items ? (
          <footer className="flex flex-col md:flex-row gap-10 md:gap-[120px] md:items-start pt-[20px] pb-[60px] border-b border-white/10">
            <div className="md:h-[280px] flex  flex-col justify-between gap-6 md:max-w-xs">
              <div>
                {footer_items.logo && <div className="inline-block bg-white rounded-2xl px-3! py-2! -ml-1">{footer_items.logo}</div>}

                {footer_items.description && (
                  <p dangerouslySetInnerHTML={{ __html:footer_items.description}} className="text-[15px] pt-[14px] text-white/65 max-w-sm leading-relaxed ">
                  </p>
                )}
              </div>

              {footer_items.navItems[0] && (
                <div className="mt-4">
                  <h3 className="font-bold text-[15px] mb-[13px] text-white uppercase tracking-wide">
                    {footer_items.navItems[0].title}
                  </h3>
                  <ul className="flex flex-col gap-[11px]">
                    {footer_items.navItems[0].list.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-[14px] text-white/70"
                        dangerouslySetInnerHTML={{ __html: item.titleHtml }}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {footer_items.navItems.slice(1).map((navGroup, groupIdx) => (
              <div key={groupIdx} className="flex flex-col gap-4 md:pl-8">
                <h3 className="font-bold text-[15px] text-white uppercase tracking-wide">{navGroup.title}</h3>
                <ul className="flex flex-col gap-2.5">
                  {navGroup.list.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <a
                        href={item.link || "#"}
                        className="text-[14px] text-white/70 hover:text-white block transition-colors"
                        dangerouslySetInnerHTML={{ __html: item.titleHtml }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </footer>
        ) : null}
        <p className="text-white/40 text-xs pt-6!">© 2026 KantsBum. Все права защищены.</p>
      </Wrapper>
    </div>
  );
};
