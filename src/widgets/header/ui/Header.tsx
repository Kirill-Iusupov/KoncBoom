"use client";

import { Logo } from "@/src/shared/ui/Logo";
import Link from "next/link";
import { Wrapper } from "./Wrapper";
import Search from "@/src/features/search";
import NavLinksWithSearch from "@/src/features/navLinksWithSearch";
import { CartButton } from "@/src/shared/ui/CartButton";

export const Header = () => {
  return (
    <div className="bg-[#3B82F666]">
      <Wrapper>
        <nav className="flex justify-between items-center p-4!">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex gap-4 items-center">
            <NavLinksWithSearch />
            <CartButton />
          </div>
        </nav>
      </Wrapper>
    </div>
  );
};
