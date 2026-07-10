'use client';

import React, { useMemo } from 'react';
import { Table, ConfigProvider } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { delivaryTable } from '../model/delivare.mock';

export const DeliveryTable = () => {

  const columns: ColumnsType<typeof delivaryTable[0]> = [
    {
      title: 'Контрагент',
      dataIndex: 'contractor',
      align: 'center',
      render: (value, _, index) => {
        const obj = { children: <span className="font-medium">{value}</span>, props: { rowSpan: 1 } };
        if (index === 0) obj.props.rowSpan = 2;
        if (index === 1) obj.props.rowSpan = 0;
        if (index === 2) obj.props.rowSpan = 3;
        if (index === 3 || index === 4) obj.props.rowSpan = 0;
        return obj;
      },
    },
    {
      title: 'Регион',
      dataIndex: 'region',
      render: (value, _, index) => {
         const obj = { children: value, props: { rowSpan: 1 } };
         if (index === 3) obj.props.rowSpan = 2;
         if (index === 4) obj.props.rowSpan = 0;
         return obj;
      }
    },
    {
      title: 'Сумма заказа',
      dataIndex: 'amount',
    },
    {
      title: 'Стоимость доставки',
      dataIndex: 'cost',
    },
  ];

  const groupedMobileData = useMemo(() => {
    return delivaryTable.reduce((acc, curr) => {
      if (!acc[curr.contractor]) {
        acc[curr.contractor] = [];
      }
      acc[curr.contractor].push(curr);
      return acc;
    }, {} as Record<string, typeof delivaryTable>);
  }, []);

  return (
    <section className="mt-[60px] md:mt-[80px] mb-[80px] md:mb-[125px]">
      <h3 className="text-[24px] md:text-[32px] font-bold text-center mb-6 md:mb-8">
        Стоимость доставки:
      </h3>

      <div className="block md:hidden space-y-6">
        {Object.entries(groupedMobileData).map(([contractor, items]) => (
          <div key={contractor} className="border border-black flex flex-col">

            <div className="bg-gray-100 p-3 font-bold text-center border-b border-black text-lg">
              {contractor}
            </div>
            
 
            <div className="flex flex-col bg-white">
              {items.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-4 border-b border-black last:border-b-0 flex flex-col gap-2"
                >
                  <div className="font-semibold text-[16px]">{item.region}</div>
                  
                  <div className="flex flex-col gap-1 text-[14px]">
                    <div className="flex gap-2">
                      <span className="text-gray-500 min-w-[60px]">Сумма:</span>
                      <span>{item.amount}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 min-w-[60px]">Цена:</span>
                      <span>{item.cost}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>


      <div className="hidden md:block ">
        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: '#ffffff',
                headerColor: '#000000',
                borderColor: '#000000',
                borderRadius: 0,
                headerBorderRadius: 0,
                cellPaddingBlock: 16,
                rowHoverBg: 'transparent',
              },
            },
          }}
        >
          <Table 
            columns={columns} 
            dataSource={delivaryTable} 
            pagination={false} 
            bordered 
            className="min-w-[800px] [&_th]:!text-center" 
          />
        </ConfigProvider>
      </div>
    </section>
  );
};