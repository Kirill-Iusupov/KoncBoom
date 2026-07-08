"use client";

import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Button, Input } from "antd";

export const Search = () => {
  const { Search } = Input;

  const [collapse, setCollapse] = useState(true);

  return (
    <div className="flex items-center h-11.75">
      {collapse ? (
        <button onClick={() => setCollapse(false)} className="h-full">
          <div className="flex items-center justify-center w-14.75 rounded-md h-full bg-[#D9EEFF] cursor-pointer ">
            <SearchOutlined />
          </div>
        </button>
      ) : (
        <div onClick={() => setCollapse(true)} className="h-full">
          <Search
            name="search"
            className="absolute bg-[#D9EEFF] rounded-md border-none w-full! h-full top-0 right-0"
            placeholder="Поиск по концелярии..."
            enterButton={
              <Button
                className="bg-[#D9EEFF]! w-14.75! h-full!"
                icon={<SearchOutlined />}
              />
            }
          />
        </div>
      )}
    </div>
  );
};
