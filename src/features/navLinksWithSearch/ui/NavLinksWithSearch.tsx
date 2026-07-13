import Link from "next/link";

import { links } from "@/src/shared/links/links";
import { Search } from "@/src/shared/ui/Search";

export const NavLinksWithSearch = ({ isMobileView }: { isMobileView?: boolean })=> {
  return (
    <div className="flex gap-4 items-center justify-between  relative">
      <div className="flex gap-4 items-center">
      {links.slice(1).map((link: any) => {
        return (
          <Link
            key={link.url}
            href={link.url}
            className="hover:underline cursor-pointer text-center md:min-w-25"
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
