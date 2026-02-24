import { ReactNode } from "react";

interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
}

export function SectionTitle({ children, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-8">
      {subtitle ? <p className="caps mb-3 text-accent">{subtitle}</p> : null}
      <h2 className="text-[28px] leading-tight md:text-[34px]">{children}</h2>
    </div>
  );
}
