export const MainPageInfoBlock = () => {
  const h3Style = "text-[22px] md:text-[26px] font-num font-semibold text-brand-ink";
  const infoStyle = "flex flex-col items-center gap-1 text-center";
  const divStyle =
    "bg-white py-[22px] md:py-6 h-full flex flex-row items-center justify-center";

  return (
    <div className="w-full rounded-3xl bg-white shadow-[0_20px_48px_-12px_rgba(16,25,42,0.22)] border border-brand-border grid grid-cols-2 md:grid-cols-4 gap-px bg-brand-border overflow-hidden">
      <div className={divStyle}>
        <div className={infoStyle}>
          <h3 className={h3Style}>1 200+</h3>
          <p className="text-brand-muted text-sm">товаров</p>
        </div>
      </div>
      <div className={divStyle}>
        <div className={infoStyle}>
          <h3 className={h3Style}>45+</h3>
          <p className="text-brand-muted text-sm">брендов</p>
        </div>
      </div>
      <div className={divStyle}>
        <div className={infoStyle}>
          <h3 className={h3Style}>Бесплатно</h3>
          <p className="text-brand-muted text-sm">Доставка от 2500 сом</p>
        </div>
      </div>
      <div className={divStyle}>
        <div className={infoStyle}>
          <h3 className={h3Style}>1 день</h3>
          <p className="text-brand-muted text-sm">Доставка по Бишкеку</p>
        </div>
      </div>
    </div>
  );
};
