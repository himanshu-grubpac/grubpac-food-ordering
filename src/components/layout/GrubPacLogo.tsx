import Image from "next/image";
import { cn } from "@/lib/utils";
import { LOGO_PATH, SITE_NAME } from "@/lib/branding";

interface GrubPacLogoProps {
  className?: string;
  imageClassName?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-8",
  md: "h-10",
  lg: "h-14",
};

export function GrubPacLogo({
  className,
  imageClassName,
  showWordmark = false,
  size = "md",
}: GrubPacLogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src={LOGO_PATH}
        alt={SITE_NAME}
        width={180}
        height={60}
        priority
        className={cn(
          "w-auto object-contain dark:brightness-110",
          sizeMap[size],
          imageClassName
        )}
        style={{ width: "auto", height: "auto", maxHeight: size === "lg" ? "3.5rem" : size === "md" ? "2.5rem" : "2rem" }}
      />
      {showWordmark && <span className="sr-only">{SITE_NAME}</span>}
    </div>
  );
}
