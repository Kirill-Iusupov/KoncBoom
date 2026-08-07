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

    <div className="bg-white/90 backdrop-blur-md sticky top-0 z-20 border-b border-brand-border">
      <Wrapper>
        <nav className="flex justify-between items-center py-3.5!">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="shrink-0">
            <Logo />
          </Link>

          <div className="hidden md:flex gap-6 items-center">
            <NavLinksWithSearch />
            <CartButton />
          </div>

          <div className="flex md:hidden items-center gap-3">
            <CartButton />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full border border-brand-border focus:outline-none text-brand-ink"
              aria-label="Toggle menu"
            >
             {isMenuOpen ? (
                <CloseOutlined className="text-lg" />
              ) : (
                <MenuOutlined className="text-lg" />
              )}
            </button>
          </div>
        </nav>
      </Wrapper>

      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white md:hidden shadow-lg border-t border-brand-border">
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
