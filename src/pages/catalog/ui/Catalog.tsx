"use client";

import ItemCard from "@/src/features/ItemCard";
import { items } from "@/src/shared/mock/data";
import { Wrapper } from "@/src/shared/ui/Wrapper";
import { CategoryFilters } from "@/src/widgets/categoriesFilter/ui/CategoryFilters";
import { Pagination } from "antd";
import { useState } from "react";

export const Catalog = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedItems = items.slice((currentPage - 1) * 4, currentPage * 4);

  return (
    <div className="my-20">
      <Wrapper>
        <div className="w-full flex flex-col justify-center gap-10 ">
          <CategoryFilters />
          <div className="flex flex-wrap gap-5">
            {paginatedItems.map((item) => (
              <ItemCard item={item} key={item.id} />
            ))}
          </div>
          <Pagination
            align="center"
            total={items.length}
            defaultCurrent={1}
            pageSize={4}
            current={currentPage}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </Wrapper>
    </div>
  );
};
