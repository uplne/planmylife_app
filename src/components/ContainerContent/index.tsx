import './ContainerContent.css';

type ComponentProps = {
  children: React.ReactNode,
};

export const ContainerContent = ({ children }: ComponentProps) =>
  <div className="container-content">
    {children}
  </div>;
