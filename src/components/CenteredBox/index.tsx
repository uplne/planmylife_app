import './CenteredBox.css';

type PropsTypes = {
  children: React.ReactNode,
};

export const CenteredBox = ({ children }: PropsTypes) =>
  <div className="centeredbox"> 
    {children}
  </div>;
