import { useState } from "react";

import classnames from "classnames";
import dayjs from "dayjs";

import { EditableInput } from "../EditableInput";
import { Actions } from "./Actions";
import { PlusIcon } from "../../components/Icons/PlusIcon";
import { IconButton } from "../../components/Buttons/IconButton";
import { TagInProgress } from "../../components/TaskIndicator/TagInProgress";
import { ToggleButton } from "../Buttons/ToggleButton";
import { useCategoriesStore } from "../../store/Categories";
import { useModalStore } from "../../store/Modal";
import { CategoryAPITypes } from "../../store/Categories/api";
import { GoalsAPITypes } from "../../store/Goals/api";
import { useGoalsStore } from "../../store/Goals";
import { AddGoalTask } from "./AddGoalTask";
import { saveNewGoalTask } from "../../containers/Goals/goals.tasks.controller";
import { updateGoal } from "../../containers/Goals/goals.controller";
import { Tasks } from "./Tasks";
import { StatusTypes } from "../../types/status";
import { goalActionTypes } from "../../components/Actions/types";

const LABEL = "Add goal";

type ComponentProps = {
  className?: string | undefined;
  data: GoalsAPITypes;
};

const ALLOW: goalActionTypes[] = [
  goalActionTypes.COMPLETE,
  goalActionTypes.UNCOMPLETE,
  goalActionTypes.EDIT,
  goalActionTypes.ADDTOWEEK,
  goalActionTypes.REMOVEFROMWEEK,
  goalActionTypes.REMOVE,
];

export const Goal = ({ className = undefined, data }: ComponentProps) => {
  const categories: CategoryAPITypes[] = useCategoriesStore().categories;
  const { toggleModal } = useModalStore();
  const setTempGoal = useGoalsStore().setTempGoal;
  const [toggle, setToggle] = useState(false);
  const toggleHandler = () => setToggle(!toggle);

  const classesContent = classnames(
    "overflow-hidden transition-all ease-linear",
    {
      "h-0": !toggle,
      "h-auto": toggle,
    },
  );

  const isInProgress =
    data.assigned !== null &&
    typeof data.assigned !== "undefined" &&
    data.status !== StatusTypes.COMPLETED;

  const goalCategory = categories.find(
    (cat) => cat.categoryId === data.categoryId,
  );

  const saveNewTaskHandler = async () => {
    await saveNewGoalTask(data.goalId!);
  };

  const openTaskModal = async () => {
    await toggleModal({
      isOpen: true,
      content: <AddGoalTask data={data} />,
      title: "Add New Task",
      onSave: () => saveNewTaskHandler(),
      saveDisabled: false,
      disableAutoClose: true,
    });
  };

  const saveHandler = async (value: string) => {
    await setTempGoal({
      ...data,
      objective: value,
    });
    await updateGoal(data.goalId!);
  };

  return (
    <div className="mb-15 rounded-md relative shadow-[0px 0px 2px 0px rgba(0,0,0,0.15)] bg-white">
      <div className="flex flex-row justify-between items-center p-5 pr-15">
        <EditableInput
          id={data.goalId!}
          title={data.objective}
          label={LABEL}
          onBlur={(value) => saveHandler(value)}
          onFocus={() => {}} //onSave}
          status={data.status}
          isCompleted={data.status === StatusTypes.COMPLETED}
        />
        <div className="flex">
          {isInProgress && <TagInProgress date={dayjs(data.assigned).week()} />}
          <Actions goal={data} allow={ALLOW} />
          <ToggleButton isOpen={toggle} onClick={toggleHandler} />
        </div>
      </div>
      <div className={classesContent}>
        <div className="m-15 mt-0 border-[rgb(229,231,235)] border-t-[1px] border-0 border-solid">
          <h3 className="text-base font-normal">Why</h3>
          <p className="text-sm font-light">{data.why}</p>
          <div className="grid grid-flow-row grid-cols-2 mb-40">
            <div>
              <h3 className="text-base font-normal">Category</h3>
              <div className="flex flex-row items-center justify-start">
                <div className="text-xs text-left z-10 flex flex-row justify-start items-center bg-tag px-10 py-5 rounded-sm">
                  {goalCategory && goalCategory.title}
                  {!goalCategory && "No category"}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-normal">
                I will achieve this goal by
              </h3>
              <div className="flex flex-row items-center justify-start">
                <div className="text-xs text-left z-10 flex flex-row justify-start items-center">
                  {data && data.endDate && (
                    <span>{dayjs(data.endDate).format("DD.MM.YYYY")}</span>
                  )}
                  {data && !data.endDate && <span>No date set.</span>}
                </div>
              </div>
            </div>
          </div>

          {!isInProgress && (
            <>
              <h3 className="text-base font-normal">Tasks</h3>
              <Tasks goalId={data.goalId!} />
              <IconButton onClick={openTaskModal} secondary withCTA>
                <PlusIcon />
                Add task
              </IconButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
