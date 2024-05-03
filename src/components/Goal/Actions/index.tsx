import { Menu, Dropdown } from "antd";

import { useModalStore } from "../../../store/Modal";
import { useGoalsStore } from "../../../store/Goals";
import { StatusTypes } from "../../../types/status";
import { IconButton } from "../../Buttons/IconButton";
import { CheckIcon, BinIcon, DotsIcon, PencilIcon } from "../../Icons";
import { AddGoalModal } from "../../../containers/Goals/AddGoalModal";
import {
  completeGoal,
  removeGoal,
  updateGoal,
  revertCompletedGoal,
} from "../../../containers/Goals/goals.controller";
import { GoalsAPITypes } from "../../../store/Goals/api";

type ComponentTypes = {
  goal: GoalsAPITypes;
};

export const Actions = ({ goal }: ComponentTypes) => {
  const setTempGoal = useGoalsStore().setTempGoal;
  const resetTempGoal = useGoalsStore().resetTempGoal;
  const { toggleModal } = useModalStore();

  const completeGoalHandler = () => {
    completeGoal(goal.goalId!);
  };

  const removeGoalHandler = async () => {
    await removeGoal(goal.goalId!);
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

  const getMenu = () => {
    const items = [];

    if (goal.status === StatusTypes.COMPLETED) {
      items.push({
        label: (
          <IconButton
            className="task__button"
            onClick={unCheck}
            primary
            withCTA
          >
            <CheckIcon /> Uncheck
          </IconButton>
        ),
        key: "uncheck",
      });
    }

    if (goal.status !== StatusTypes.COMPLETED) {
      items.push({
        label: (
          <IconButton
            className="task__button"
            onClick={editGoalHandler}
            primary
            withCTA
          >
            <PencilIcon /> Edit goal
          </IconButton>
        ),
        key: "recurring_uncheck",
      });
    }

    items.push({
      label: (
        <IconButton
          className="task__button"
          onClick={removeGoalHandler}
          primary
          withCTA
        >
          <BinIcon /> Remove goal
        </IconButton>
      ),
      key: "remove",
    });

    return <Menu items={items} />;
  };

  return (
    <div className="flex flex-row items-center pl-10">
      {goal.status !== StatusTypes.COMPLETED && (
        <>
          <IconButton
            className="button__done"
            onClick={completeGoalHandler}
            primary
            hasBounce
            withCTA
          >
            <CheckIcon />
          </IconButton>
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
