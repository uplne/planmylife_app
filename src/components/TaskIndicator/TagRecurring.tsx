import { TaskIndicator } from ".";

type ComponentProps = {
  recurring?: string;
};

export const TagRecurring = ({ recurring }: ComponentProps) => (
  <TaskIndicator className="bg-tagActive text-tagText">{`recurring ${recurring}`}</TaskIndicator>
);
