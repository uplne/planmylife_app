type ComponentTypes = {
  children: React.ReactNode;
};

export const SubHeading = ({ children }: ComponentTypes) => (
  <div className="text-2xl font-bold w-full text-left my-0 mx-auto py-15 px-0">
    {children}
  </div>
);
