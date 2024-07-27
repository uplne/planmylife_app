import { TaskIndicator } from ".";

type ComponentProps = {
  date?: number;
};

export const TagInProgress = ({ date }: ComponentProps) => (
  <div className="flex flew-row justify-start items-center">
    <TaskIndicator className="bg-progress text-tagText">
      In progress
    </TaskIndicator>
    {date && (
      <TaskIndicator className="bg-tag text-tagText">Week {date}</TaskIndicator>
    )}
  </div>
);
