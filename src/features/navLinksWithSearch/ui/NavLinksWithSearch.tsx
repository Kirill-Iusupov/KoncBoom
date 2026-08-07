"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { links } from "@/src/shared/links/links";
import { Search } from "@/src/shared/ui/Search";

export const NavLinksWithSearch = ({ isMobileView }: { isMobileView?: boolean })=> {
  const pathname = usePathname();

  return (
    <div className="flex gap-6 items-center justify-between relative">
      <div className="flex gap-6 items-center">
      {links.slice(1).map((link: any) => {
        const isActive = pathname === link.url;
        return (
          <Link
            key={link.url}
            href={link.url}
            className={`relative py-1 font-medium text-center transition-colors ${
              isActive
                ? "text-brand-ink after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-[15px] after:h-[2.5px] after:bg-brand-orange after:rounded-full"
                : "text-brand-muted hover:text-brand-ink"
            }`}
          >
            {link.title}
          </Link>
        );
      })}
      </div>
           <div className={isMobileView ? " flex justify-center mt-2" : ""}>
        <Search isMobileView={isMobileView} />
      </div>
    </div>
  );
};
