"use client";

import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Button, Input } from "antd";

export const Search = () => {
  const { Search } = Input;

  const [collapse, setCollapse] = useState(true);

  return (
    <div className="flex items-center h-[47px]">
      {collapse ? (
        <button onClick={() => setCollapse(false)} className="h-full">
          <div className="flex items-center justify-center w-[59px] rounded-[6px] h-full bg-[#D9EEFF] cursor-pointer ">
            <SearchOutlined />
          </div>
        </button>
      ) : (
        <div onClick={() => setCollapse(true)} className="h-full">
          <Search
            name="search"
            className="absolute bg-[#D9EEFF] rounded-[6px] border-none w-full h-full top-0 right-0"
            placeholder="not collapsed"
            enterButton={
              <Button
                type="primary"
                className="bg-[#2f54eb] text-white h-full!"
                icon={<SearchOutlined />}
              />
            }
          />
        </div>
      )}
    </div>
  );
};
