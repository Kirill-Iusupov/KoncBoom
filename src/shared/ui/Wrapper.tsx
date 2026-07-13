import React from "react";

export const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="max-w-360  px-[20px] md:px-[80px] m-[0_auto]!">{children}</div>;
};
