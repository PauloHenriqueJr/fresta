import { ReactNode } from "react";

type B2BPageHeaderProps = {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  actions?: ReactNode;
};

export default function B2BPageHeader({ title, subtitle, badge, actions }: B2BPageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-foreground lg:text-3xl lg:tracking-tight">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && <p className="text-sm text-muted-foreground lg:text-base">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
