import './TasksBox.css';

type ComponentTypes =  {
  children: React.ReactNode,
};

export const TasksBox = ({ children }: ComponentTypes) =>
  <div className="tasksbox">{children}</div>;
