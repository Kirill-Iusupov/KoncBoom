export const TimeBlock = ({
  value,
  label,
}: {
  value: number;
  label: string;
}) => {
  
  const pad = (value: number): string => {
    return value.toString().padStart(2, "0");
  };


  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-[#1E2D42] px-4 py-2.5 min-w-[70px]">
      <span className="text-2xl font-bold text-white leading-tight">
        {pad(value)}
      </span>
      <span className="text-xs text-slate-300">{label}</span>
    </div>
  );
};
