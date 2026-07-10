import React from 'react';
import { ourValues } from '../model/ourValues.mock';
import { ValueCard } from '../components/ValueCard';

export const OurValues = () => {
    return (
    <section className="mt-[40px]">
      <h4 className='text-[30px] font-semibold'>Наши ценности</h4>
      <div className="flex mt-[20px] flex-wrap gap-[25px]">
        {ourValues.map((item) => (
          <ValueCard key={item.id} {...item} />
        ))}
      </div>
    </section>
    );
};

