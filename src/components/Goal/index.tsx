import { useState } from "react";
import classnames from "classnames";

import { EditableInput } from "..//EditableInput";
import { Actions } from "./Actions";
import { ToggleButton } from "../Buttons/ToggleButton";

import { GoalsAPITypes } from "../../store/Goals/api";

const LABEL = "Add goal";

type ComponentProps = {
  className?: string | undefined;
  data: GoalsAPITypes;
};

export const Goal = ({ className = undefined, data }: ComponentProps) => {
  const [toggle, setToggle] = useState(false);
  //   const shouldShowCompleted = () => {
  //     if (!rawTaskData) {
  //       return false;
  //     }

  //     if (
  //       rawTaskData.type !== TasksTypes.RECURRING &&
  //       rawTaskData.type !== TasksTypes.SCHEDULED_RECURRING
  //     ) {
  //       return rawTaskData.status === StatusTypes.COMPLETED;
  //     } else {
  //       if ("isInactive" in rawTaskData) {
  //         return false;
  //       } else if (isCompleted) {
  //         return true;
  //       } else {
  //         return rawTaskData.status === StatusTypes.COMPLETED;
  //       }
  //     }
  //   };

  // const shouldShowReadOnly = () =>
  //   rawTaskData &&
  //   (rawTaskData.type === TasksTypes.RECURRING ||
  //     rawTaskData.type === TasksTypes.SCHEDULED_RECURRING) &&
  //   "isInactive" in rawTaskData &&
  //   rawTaskData.isInactive;

  // const taskClasses = classnames("goal", className, {
  //   "task--hasTask": title,
  //   "task--isCompleted": shouldShowCompleted(),
  //   "task--isInactive": shouldShowReadOnly(),
  //   "task--isPlaceholder": !title,
  //   "mt-6":
  //     rawTaskData?.type === TasksTypes.SCHEDULE ||
  //     rawTaskData?.type === TasksTypes.SCHEDULED_RECURRING,
  // });

  const toggleHandler = () => setToggle(!toggle);

  const classesContent = classnames(
    "overflow-hidden transition-all ease-linear",
    {
      "h-0": !toggle,
      "h-auto": toggle,
    },
  );

  return (
    <div className="mb-15 rounded-md relative shadow-[0px 0px 2px 0px rgba(0,0,0,0.15)] bg-white">
      <div className="flex flex-row justify-between items-center p-5">
        <EditableInput
          id={data.goalId!}
          title={data.objective}
          label={LABEL}
          onBlur={() => {}} //onSave}
          onFocus={() => {}} //onSave}
          status={data.status}
        />
        <Actions goal={data} />
        <ToggleButton isOpen={toggle} onClick={toggleHandler} />
      </div>
      <div className={classesContent}>
        <div className="m-15 border-[rgb(229,231,235)] border-t-[1px] border-0 border-solid">
          <h3>Why</h3>
          <p>{data.why}</p>
        </div>
      </div>
    </div>
  );
};
