import { Button } from "antd";
import React from "react";

interface ICatBtnProps {
  title: string;
}

export const CategoriesBtn = ({ title }: ICatBtnProps) => {
  return <Button>{title}</Button>;
};
