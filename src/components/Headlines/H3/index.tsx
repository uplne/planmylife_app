import classnames from "classnames";

export const H3 = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h3 className={classnames("mt-0 mb-2 text-sm font-medium", className)}>
    {children}
  </h3>
);
