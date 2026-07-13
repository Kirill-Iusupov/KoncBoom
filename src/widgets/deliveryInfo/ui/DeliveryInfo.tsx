"use client"
import { ClockCircleOutlined, PhoneOutlined } from '@ant-design/icons';
import delivery from '../../../shared/imgs/delivery.webp'
import Image from 'next/image';

export const DeliveryInfo = () => {
    
  return (
    <section className="mt-[115px]">
      <h4 className='text-[30px] font-semibold'>Доставка</h4>
      <p className="text-gray-700 mb-8">
        На сегодняшний день оперативную доставку в течение 1 рабочего дня мы организуем в пределах г. Бишкек.
      </p>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 flex flex-col gap-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-gray-600 flex items-center justify-center flex-shrink-0 font-bold" ><PhoneOutlined /></div>
            
            <p className="text-sm text-gray-800">
              Наши менеджеры сопровождения продаж свяжутся с Вами сразу же после оформления заказа, чтобы уточнить удобное для Вас время и день доставки.<br/>
              Бесплатная доставка по г. Бишкек при оформлении заказа онлайн юридическим лицам.
            </p>
          </div>
          <div className="flex items-start gap-4">
             <div className="w-10 h-10 rounded-full border-2 border-gray-600 flex items-center justify-center flex-shrink-0 text-red-500">
               <ClockCircleOutlined />
             </div>
            <p className="text-sm text-gray-800">
              Доставка осуществляется в рабочие дни с 9:00 до 18:00, в течение 1 рабочего дня с момента оформления заказа.
            </p>
          </div>
           <div className="flex items-start gap-4">
             <div className="w-10 h-10 rounded-full border-2 border-gray-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
               FREE
             </div>
            <p className="text-sm text-gray-800">
              Доставка заказа по Кыргызстану осуществляется почтовым отправлением, транспортно-экспедиторской компанией. Расходы по доставке выставляются в счете на оплату.
            </p>
          </div>
        </div>

        <div className="flex-1 w-full relative h-[250px] lg:h-[300px] rounded-lg overflow-hidden bg-gray-200">
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <Image src={delivery} alt="Машины доставки" fill className="object-cover" />
            </div>
        </div>
      </div>
    </section>
  );
};