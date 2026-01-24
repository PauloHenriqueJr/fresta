import { ReactNode } from "react";

type B2BPageHeaderProps = {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  actions?: ReactNode;
};

export default function B2BPageHeader({ title, subtitle, badge, actions }: B2BPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0E220E] dark:text-[#F6D045]">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="text-sm mt-1 text-muted-foreground/60 dark:text-white/40 font-medium">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
