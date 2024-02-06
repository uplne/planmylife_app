import classnames from "classnames";

type ComponentPropTypes = {
  className?: string;
};

export const HierarchyIcon = ({
  className = undefined,
}: ComponentPropTypes) => {
  const classes = classnames("hierarchy-icon icon", className);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="5"
      className={classes}
    >
      <defs>
        <image
          width="11"
          height="5"
          id="img1"
          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAFAQMAAACpaIQVAAAAAXNSR0IB2cksfwAAAAZQTFRFAAAAAAAApWe5zwAAAAJ0Uk5T/wDltzBKAAAAE0lEQVR4nGOof8Dw/wEDhAx1AAA5kwcS9b/QsgAAAABJRU5ErkJggg=="
        />
      </defs>
    </svg>
  );
};
