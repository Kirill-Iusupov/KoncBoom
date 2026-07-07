import Image from "next/image";
import logo from "@/src/shared/assets/KancBoom.svg";

export const Logo = () => {
  return <Image src={logo} alt="Logo" width={100} height={100} />;
};
