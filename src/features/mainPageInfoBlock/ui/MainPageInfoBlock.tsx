export const MainPageInfoBlock = () => {
  const h3Style = "text-[24px] font-bold text-black";
  const infoStyle = "flex flex-col items-center gap-1";
  const divStyle =
    "w-full h-full flex flex-col items-center justify-center border-1 border-[#D9D9D9]";

  return (
    <div className="w-full h-36.75 bg-[#EAEEF2] flex justify-around items-center ">
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
  );
};
