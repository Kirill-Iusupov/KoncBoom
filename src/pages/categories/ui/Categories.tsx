import { Wrapper } from "@/src/shared/ui/Wrapper";
import ListCategories from "@/src/widgets/categoriesOnMain/ui/components/ListCategories";
import Heading from "@/src/widgets/heading";
import React from "react";

export const Categories = () => {
  return (
    <>
      <Heading />
      <Wrapper>
        <div className="py-[40px]">
          <ListCategories />
        </div>
      </Wrapper>
    </>
  );
};
