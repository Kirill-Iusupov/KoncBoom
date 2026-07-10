"use client";

import { SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useSearchStore } from "../model/store/useSearcCollapseStore";
import { useRef } from "react";

export const Search = () => {
  const { Search } = Input;
  const searchRef = useRef<HTMLDivElement>(null);

  const { collapsed, setCollapsed } = useSearchStore();

  const handleBlur = (e: React.FocusEvent) => {
    // проверка куда ушел фокус
    const nextFocusTarget = e.relatedTarget as Node | null;

    // если фокус остался внутри блока поиска, то не сворачиваемся
    if (nextFocusTarget && searchRef.current?.contains(nextFocusTarget)) {
      return;
    }

    setCollapsed(true);
  };

  const handleSearch = (e: any) => {
    alert(`Тут будет логика получения списка по запросу => ${e.target.value}`);
  };

  return (
    <div className="flex items-center h-11.75">
      {collapsed ? (
        <button onClick={() => setCollapsed(false)} className="h-full">
          <div className="flex items-center justify-center w-14.75 rounded-md h-full bg-[#D9EEFF] cursor-pointer ">
            <SearchOutlined />
          </div>
        </button>
      ) : (
        <Search
          name="search"
          autoFocus
          onPressEnter={(e) => handleSearch(e)}
          className="absolute bg-[#D9EEFF] rounded-md border-none w-full h-full top-0 right-0"
          placeholder="Поиск по концелярии..."
          onBlur={handleBlur}
          enterButton={
            <Button
              className="bg-[#D9EEFF] w-14.75 h-full border-none hover:border-none"
              icon={<SearchOutlined />}
            />
          }
        />
      )}
    </div>
  );
};
