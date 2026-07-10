import React from 'react';
import { ContactCard } from '../components/ContactCard';
import { contacts } from '../model/contact.mock';
export const Contacts = () => {
  return (
    <section className="mt-[80px]">
      <h4 className='text-[30px] font-semibold'>Контакты</h4>
      <div className="flex mt-[20px] flex-wrap gap-[25px]">
        {contacts.map((item) => (
          <ContactCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
};