import { TaskIndicator } from ".";

type ComponentProps = {
  children: React.ReactNode;
};

export const TagStatus = ({ children }: ComponentProps) => (
  <div className="flex flew-row justify-start items-center">
    <TaskIndicator className="bg-tag text-tagText">{children}</TaskIndicator>
  </div>
);
