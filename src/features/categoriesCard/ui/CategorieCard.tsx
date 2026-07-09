import { DataFormat } from "@/src/shared/model/types";
import Image from "next/image";
import Link from "next/link";

interface ICatProps {
  item: DataFormat;
}

const CategorieCard = ({ item }: ICatProps) => {
  return (
    <Link
      href="/"
      className="w-[calc((100%/6)-20px)] h-50 rounded bg-[#E6EEF2] border flex flex-col items-center justify-center"
    >
      <Image src={item.icon} alt={item.description} width={60} height={60} />
      <strong>{item.title}</strong>
      <p>{item.count} товаров</p>
    </Link>
  );
};

export default CategorieCard;
