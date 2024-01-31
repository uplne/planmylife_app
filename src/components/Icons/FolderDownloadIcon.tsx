import classnames from 'classnames';

type ComponentPropTypes = {
  className?: string,
};

export const FolderDownloadIcon = ({ className = undefined }: ComponentPropTypes) => {
  const classes = classnames('folderdownload-icon icon', className);

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <path d="m18 8-4-4H0v26h32V8H18zm-2 19-7-7h5v-8h4v8h5l-7 7z" />
    </svg>
  );
};
