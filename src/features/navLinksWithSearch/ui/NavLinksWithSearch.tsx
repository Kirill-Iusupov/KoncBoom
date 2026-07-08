import Link from "next/link";

import { links } from "@/src/shared/links/links";
import { Search } from "@/src/shared/ui/Search";

export const NavLinksWithSearch = () => {
  return (
    <div className="flex gap-4 items-center relative">
      {links.slice(1).map((link: any) => {
        return (
          <Link
            key={link.url}
            href={link.url}
            className="hover:underline cursor-pointer text-center"
          >
            {link.title}
          </Link>
        );
      })}
      <Search />
    </div>
  );
};
