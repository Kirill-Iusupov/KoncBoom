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
          <div className="flex items-center justify-center w-14.75 rounded-md h-full bg-[#D9EEFF] cursor-pointer">
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
          className="absolute bg-[#D9EEFF] rounded-md border-none w-full h-full top-0 right-0"
          placeholder="Поиск по концелярии..."
          enterButton={
            <Button
              onClick={handleSearch}
              className="bg-[#D9EEFF] w-14.75 h-full border-none hover:border-none"
              icon={<SearchOutlined />}
            />
          }
        />
      )}
    </div>
  );
};
