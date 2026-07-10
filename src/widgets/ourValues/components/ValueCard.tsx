import React from 'react';

interface ValueCardProps {
  title: string;
  description: string;
  bgColor: string;
}

export const ValueCard = ({ title, description, bgColor }: ValueCardProps) => {
  return (
    <div className={`w-[calc((100%/4)-20px)] py-[75px] pb-[25px] px-[30px] bg-gradient-to-r ${bgColor} rounded-xl  min-h-[190px] flex flex-col justify-center shadow-sm`}>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm pt-[10px]  text-gray-800 leading-snug font-medium opacity-90">{description}</p>
    </div>
  );
};