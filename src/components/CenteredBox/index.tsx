type PropsTypes = {
  children: React.ReactNode,
};

export const CenteredBox = ({ children }: PropsTypes) =>
  <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full flex flex-column justify-center items-center"> 
    {children}
  </div>;
