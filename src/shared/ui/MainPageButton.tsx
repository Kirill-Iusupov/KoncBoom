import Link from "next/link";

interface IButtonProps {
  title: string;
  url: string;
  color?: string;
  bColor?: string;
}

export const MainPageButton = ({
  title,
  url,
  color = "F5F5F5",
  bColor = "1E2D42",
}: IButtonProps) => {
  return (
    <button
      className={
        "text-black py-2 px-4 rounded border-[1px_1px_4px_1px] p-4 cursor-pointer"
      }
      style={{ backgroundColor: `#${color}`, borderColor: `#${bColor}` }}
    >
      <Link href={`/${url}`}>{title}</Link>
    </button>
  );
};
