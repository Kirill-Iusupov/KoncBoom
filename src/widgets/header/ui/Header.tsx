"use client";
import { useState } from "react";
import Link from "next/link";

import { Logo } from "@/src/shared/ui/Logo";
import NavLinksWithSearch from "@/src/features/navLinksWithSearch";
import { CartButton } from "@/src/shared/ui/CartButton";
import { Wrapper } from "@/src/shared/ui/Wrapper";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (

    <div className="bg-[#3B82F666] relative z-20">
      <Wrapper>
        <nav className="flex justify-between items-center py-4!">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <Logo />
          </Link>

          <div className="hidden md:flex gap-4 items-center">
            <NavLinksWithSearch />
            <CartButton />
          </div>

          <div className="flex md:hidden items-center gap-4">
            <CartButton />
            <button
              onClick={toggleMenu}
              className="p-2 focus:outline-none text-black"
              aria-label="Toggle menu"
            >
             {isMenuOpen ? (
                <CloseOutlined className="text-xl" />
              ) : (
                <MenuOutlined className="text-xl" />
              )}
            </button>
          </div>
        </nav>
      </Wrapper>

      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-blue-50 md:hidden shadow-lg border-t border-blue-200">
          <Wrapper>
            <div
              className="flex flex-col gap-4 py-4"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.tagName === "A" || target.closest("a")) {
                  setIsMenuOpen(false);
                }
              }}
            >
              <NavLinksWithSearch isMobileView={true}/>
            </div>
          </Wrapper>
        </div>
      )}
    </div>
  );
};
