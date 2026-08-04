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
    <div className="flex flex-col items-center justify-center rounded-xl bg-brand-ink px-3.5 py-2 min-w-[64px]">
      <span className="font-num text-xl font-semibold text-white leading-tight">
        {pad(value)}
      </span>
      <span className="text-[11px] text-white/60">{label}</span>
    </div>
  );
};
