"use client"
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Pagination } from 'antd';

type CustomPaginationProps = {
  total: number;
  currentPage: number;
  pageSize?: number;
  onChange: (page: number) => void;
};

const CustomPagination = ({
  total,
  currentPage,
  pageSize = 4, 
  onChange,
}: CustomPaginationProps) => {

  const renderItem = (page: number, type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next', originalElement: React.ReactNode) => {
   
    if (type === 'prev') {
      return (
        <button className="flex items-center justify-center w-[45px] h-[45px] bg-[#F59E0B] hover:bg-[#D97706] active:translate-y-[2px] text-[#001529] font-bold rounded-[8px] border-b-4 border-[#D97706] transition-all mr-2">
          <LeftOutlined className="text-[16px] font-extrabold" />
        </button>
      );
    }
    

    if (type === 'next') {
      return (
        <button className="flex items-center justify-center w-[45px] h-[45px] bg-[#F59E0B] hover:bg-[#D97706] active:translate-y-[2px] text-[#001529] font-bold rounded-[8px] border-b-4 border-[#D97706] transition-all ml-2">
          <RightOutlined className="text-[16px] stroke-[3px]" />
        </button>
      );
    }
    

    if (type === 'page') {
      const isActive = page === currentPage;
      

      const totalPages = Math.ceil(total / pageSize);
      const isFirstPage = page === 1;
      const isLastPage = page === totalPages;

      return (
        <span
          className={`
            flex items-center justify-center w-[40px] h-[40px] font-medium text-[16px] transition-all cursor-pointer relative
            ${isActive 
              ? 'bg-white text-black border-[3px] border-black rounded-[5px] font-bold z-20 shadow-sm scale-105 mx-1' 
              : `bg-[#F9FAFB] text-gray-700 border border-gray-300 hover:bg-gray-100 z-10 -ml-[1px]
                 ${isFirstPage ? 'rounded-l-[5px] ml-0' : ''} 
                 ${isLastPage ? 'rounded-r-[5px]' : ''}`
            }
          `}
        >
          {page}
        </span>
      );
    }
    
    return originalElement;
  };

  return (
    <Pagination
      align="center"
      total={total}
      pageSize={pageSize}
      current={currentPage}
      onChange={onChange}
      className="ant-custom-pure flex items-center justify-center gap-0"
      itemRender={renderItem}
    />
  );
};

export default CustomPagination;