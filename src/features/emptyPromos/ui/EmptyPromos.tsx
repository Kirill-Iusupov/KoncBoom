interface IEmptyPromosProps {
  title?: string;
  description?: string;
}

export const EmptyPromos = ({
  title = "Сейчас нет активных акций",
  description = "Загляните позже — мы регулярно добавляем новые скидки и предложения",
}: IEmptyPromosProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-3 py-16 px-6 mt-10 rounded-3xl bg-[#E6EEF2] text-center ">
      <h3 className="text-[#1E2D42] text-lg font-bold">{title}</h3>
      <p className="text-[#6B7A8F] text-sm max-w-xs">{description}</p>
    </div>
  );
};
