type ComponentProps = {
  children: React.ReactNode,
};

export const Split = ({ children }: ComponentProps) => 
  <div className="flex flex-row md:basis-full w-full md:w-1/2 basis-0.5 justify-center first:md:mr-15 first:mr-10 last:md:ml-15 last:m-0">
    {children}
  </div>;
