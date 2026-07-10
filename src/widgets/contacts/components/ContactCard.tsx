import React from 'react';

interface ContactCardProps {
  title: string;
  details: string;
}

export const ContactCard = ({ title, details }: ContactCardProps) => {
  return (
    <div className="w-[calc((100%/4)-20px)]  bg-[#bce0fd] rounded-xl p-[30px]  min-h-[130px] flex flex-col items-center justify-center">
        <div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{details}</p>
      </div>
    </div>
  );
}; 