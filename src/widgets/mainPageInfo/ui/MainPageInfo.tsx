import Link from "next/link";

const MainPageInfo = () => {
  const h3Style = "text-[24px] font-bold text-black";
  const infoStyle = "flex flex-col items-center gap-1";
  const divStyle =
    "w-full h-full flex flex-col items-center justify-center border-1 border-[#D9D9D9]";

  return (
    <div className="flex flex-col gap-5 items-start text-center pt-10!">
      <p className="uppercase!">канцелярский магазин бишкек</p>
      <h1 className="text-[96px] font-semibold letter-spacing-[2%] text-[#1E2D42]">
        Всё для творчества и работы
      </h1>
      <p>
        Ручки, карандаши, блокноты, папки и всё, что нужно школьникам, студентам
        и офисным работникам.
      </p>
      <div className="flex gap-50 my-20">
        <button className="bg-[#FF6B00] text-white py-2 px-4 rounded border-[1px_1px_4px_1px] border-[#D97706] p-4 cursor-pointer">
          <Link href="/promotions">Акции</Link>
        </button>
        <button className="bg-[#F5F5F5] text-black py-2 px-4 rounded border-[1px_1px_4px_1px] border-[#1E2D42] p-4 cursor-pointer">
          <Link href="/categories">Все категории</Link>
        </button>
      </div>
      <div className="w-full h-[147px] bg-[#EAEEF2] flex justify-around items-center ">
        <div className={divStyle}>
          <div className={infoStyle}>
            <h3 className={h3Style}>1200+</h3>
            <p>товаров</p>
          </div>
        </div>
        <div className={divStyle}>
          <div className={infoStyle}>
            <h3 className={h3Style}>45+</h3>
            <p>брендов</p>
          </div>
        </div>
        <div className={divStyle}>
          <div className={infoStyle}>
            <h3 className={h3Style}>Беслатно</h3>
            <p>Доставка от 2500 сом</p>
          </div>
        </div>
        <div className={divStyle}>
          <div className={infoStyle}>
            <h3 className={h3Style}>1 день</h3>
            <p>Доставка по Бишкеку</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPageInfo;
