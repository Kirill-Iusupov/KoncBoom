"use client";

import { SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useSearchStore } from "../model/store/useSearcCollapseStore";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const { Search: AntSearch } = Input;

export const Search = ({ isMobileView }: { isMobileView?: boolean }) => {
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { collapsed, setCollapsed } = useSearchStore();

  const [query, setQuery]: [string, (data: string) => void] = useState("");

  const handleBlur = (e: React.FocusEvent) => {
    const nextFocusTarget = e.relatedTarget as Node | null;

    if (nextFocusTarget && searchRef.current?.contains(nextFocusTarget)) {
      return;
    }

    setCollapsed(true);
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?search=${encodeURIComponent(query)}`);
    setQuery("");
    setCollapsed(true);
  };

  useEffect(() => {
    if (isMobileView) setCollapsed(true);
  }, [isMobileView, setCollapsed]);

  useEffect(() => {
    if (isMobileView) setCollapsed(true);
  }, []);

  return (
    <div ref={searchRef} className="flex items-center h-11.75">
      {collapsed ? (
        <button onClick={() => setCollapsed(false)} className="h-full">
          <div className="flex items-center justify-center w-11.75 rounded-full h-full border border-brand-border text-brand-muted hover:border-brand-ink/30 hover:text-brand-ink transition-colors cursor-pointer">
            <SearchOutlined />
          </div>
        </button>
      ) : (
        <AntSearch
          name="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onPressEnter={handleSearch}
          onBlur={handleBlur}
          className="absolute !bg-brand-blue-tint !rounded-full border-[1px solid black] w-full h-full top-0 right-0 overflow-hidden"
          placeholder="Поиск по канцелярии..."
          enterButton={
            <Button
              onClick={handleSearch}
              className="!bg-brand-blue-tint w-14.75 h-full border-none hover:border-none"
              icon={<SearchOutlined />}
            />
          }
        />
      )}
    </div>
  );
};
