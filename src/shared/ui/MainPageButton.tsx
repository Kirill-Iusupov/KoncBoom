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
    <Link
      href={`/${url}`}
      className={
        "text-black py-2 px-4 rounded border-[1px_1px_4px_1px] p-4 cursor-pointer active:translate-y-0.5 active:shadow-[0_1px_0_0_rgba(180,120,10,1)]"
      }
      style={{
        backgroundColor: `#${color}`,
        borderColor: `#${bColor}`,
      }}
    >
      {title}
    </Link>
  );
};
