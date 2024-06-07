import { Menu, Dropdown } from "antd";
import dayjs from "dayjs";

import { useModalStore } from "../../../store/Modal";
import { useGoalsStore } from "../../../store/Goals";
import { useWeekStore } from "../../../store/Week";
import { StatusTypes } from "../../../types/status";
import { IconButton } from "../../Buttons/IconButton";
import {
  CheckIcon,
  BinIcon,
  DotsIcon,
  PencilIcon,
  RocketIcon,
  ArrowCircleRight,
} from "../../Icons";
import { AddGoalModal } from "../../../containers/Goals/AddGoalModal";
import {
  completeGoal,
  removeGoal,
  updateGoal,
  revertCompletedGoal,
  addToWeeklyTasks,
  removeFromWeeklyTasks,
  moveToNextWeek,
} from "../../../containers/Goals/goals.controller";
import { GoalsAPITypes } from "../../../store/Goals/api";
import { defaultCopy } from "../../Actions/Actions";
import { goalActionTypes } from "../../Actions/types";

type ComponentTypes = {
  goal: GoalsAPITypes;
  allow: goalActionTypes[];
};

const COPY = {
  ...defaultCopy,
  remove: "Remove goal",
  edit: "Edit goal",
  removeFromWeek: "Remove goal from week",
};

export const Actions = ({ goal, allow }: ComponentTypes) => {
  const setTempGoal = useGoalsStore().setTempGoal;
  const resetTempGoal = useGoalsStore().resetTempGoal;
  const { toggleModal } = useModalStore();
  const selectedWeek = useWeekStore().selectedWeek;

  const completeGoalHandler = () => {
    completeGoal(goal.goalId!);
  };

  const removeGoalHandler = async () => {
    await removeGoal(goal.goalId!);
  };

  const moveToNextWeekHandler = async () => {
    await moveToNextWeek(goal.goalId!);
  };

  const unCheck = async () => {
    await revertCompletedGoal(goal.goalId!);
  };

  const saveEditedGoal = async () => {
    await updateGoal(goal.goalId!);
  };

  const editGoalHandler = async () => {
    await resetTempGoal();
    await setTempGoal(goal);

    await toggleModal({
      isOpen: true,
      content: <AddGoalModal goal={goal} editMode />,
      title: "Edit Goal",
      onSave: () => saveEditedGoal(),
      disableAutoClose: true,
    });
  };

  const addToWeek = async () => {
    addToWeeklyTasks(goal.goalId!);
  };

  const removeGoalFromWeek = async () => {
    removeFromWeeklyTasks(goal.goalId!);
  };

  const shouldShowRemoveFromTheWeek = (): boolean =>
    Boolean(
      goal?.assigned &&
        dayjs(goal.assigned).isSame(dayjs(selectedWeek), "week"),
    );

  const getMenu = () => {
    const items = [];

    if (
      goal.status === StatusTypes.COMPLETED &&
      allow.includes(goalActionTypes.UNCOMPLETE)
    ) {
      items.push({
        label: (
          <IconButton
            className="task__button"
            onClick={unCheck}
            primary
            withCTA
          >
            <CheckIcon /> {COPY.unComplete}
          </IconButton>
        ),
        key: "uncheck",
      });
    }

    if (
      goal.status !== StatusTypes.COMPLETED &&
      allow.includes(goalActionTypes.EDIT)
    ) {
      items.push({
        label: (
          <IconButton
            className="task__button"
            onClick={editGoalHandler}
            primary
            withCTA
          >
            <PencilIcon /> {COPY.edit}
          </IconButton>
        ),
        key: "recurring_uncheck",
      });
    }

    if (allow.includes(goalActionTypes.ADDTOWEEK) && !goal.assigned) {
      items.push({
        label: (
          <IconButton
            className="task__button"
            onClick={() => addToWeek()}
            primary
            withCTA
          >
            <RocketIcon /> {COPY.addToWeek}
          </IconButton>
        ),
        key: "add_to_current_week",
      });
    }

    if (
      allow.includes(goalActionTypes.REMOVEFROMWEEK) &&
      shouldShowRemoveFromTheWeek()
    ) {
      items.push({
        label: (
          <IconButton
            className="task__button"
            onClick={removeGoalFromWeek}
            primary
            withCTA
          >
            <BinIcon /> {COPY.removeFromWeek}
          </IconButton>
        ),
        key: "remove_for_week",
      });
    }

    if (allow.includes(goalActionTypes.REMOVE)) {
      items.push({
        label: (
          <IconButton
            className="task__button"
            onClick={removeGoalHandler}
            primary
            withCTA
          >
            <BinIcon /> {COPY.remove}
          </IconButton>
        ),
        key: "remove",
      });
    }

    return <Menu items={items} />;
  };

  return (
    <div className="flex flex-row items-center pl-10">
      {goal.status !== StatusTypes.COMPLETED &&
        allow.includes(goalActionTypes.COMPLETE) && (
          <>
            <IconButton onClick={completeGoalHandler} primary hasBounce>
              <CheckIcon />
            </IconButton>
            {allow.includes(goalActionTypes.MOVE) && (
              <IconButton onClick={moveToNextWeekHandler} primary>
                <ArrowCircleRight />
              </IconButton>
            )}
          </>
        )}
      <Dropdown overlay={getMenu()} trigger={["click"]}>
        <a onClick={(e) => e.preventDefault()}>
          <IconButton onClick={() => {}} primary hasBounce>
            <DotsIcon />
          </IconButton>
        </a>
      </Dropdown>
    </div>
  );
};
