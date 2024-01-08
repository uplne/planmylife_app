import './SubHeading.css';

type ComponentTypes =  {
  title: string,
};

export const SubHeading = ({ title }: ComponentTypes) =>
  <div className="header">{title}</div>;
