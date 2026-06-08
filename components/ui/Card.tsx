import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-3xl bg-white border border-[#F0F0F0] p-5 sm:p-6 shadow-card transition-shadow hover:shadow-cardHover",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
