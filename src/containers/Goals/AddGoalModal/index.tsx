import { useRef, useEffect } from "react";
import type { RadioChangeEvent } from "antd";

import { useModalStore } from "../../../store/Modal";
import { useGoalsStore } from "../../../store/Goals";
import { GoalsAPITypes } from "../../../store/Goals/api";
import { GoalType } from "./GoalType";
import { GoalType as GoalTypeType } from "../../../store/Goals/api";
import { ModalRow } from "./ModalRow";
import { SMARTGoal } from "./SMARTGoal";
import { H3 } from "../../../components/Headlines/H3";
import { Categories } from "../../../components/Categories";

type ComponentTypes = {
  goal?: GoalsAPITypes;
  editMode?: boolean;
};

export const AddGoalModal = ({ goal, editMode = false }: ComponentTypes) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { toggleSaveDisable } = useModalStore();
  const setTempGoalByKey = useGoalsStore.getState().setTempGoalByKey;
  const tempGoal = useGoalsStore.getState().tempGoal;

  useEffect(() => {
    inputRef.current?.focus();

    setTempGoalByKey("goalType", GoalTypeType.SMART);

    if (editMode) {
      toggleSaveDisable(false);
    }
  }, []);

  const onChangeGoalType = (e: RadioChangeEvent) =>
    setTempGoalByKey("goalType", e.target.value);
  const categoryChangeHandler = async (categoryId: string | null) =>
    await setTempGoalByKey("categoryId", categoryId);

  return (
    <div className="w-full text-left relative">
      <ModalRow>
        <H3>Type of Goal</H3>
        <GoalType
          onChange={onChangeGoalType}
          value={tempGoal.goalType || GoalTypeType.SMART}
        />
      </ModalRow>

      <ModalRow>
        <H3>Category</H3>
        <Categories
          categoryId={goal && String(goal.categoryId)}
          onChange={categoryChangeHandler}
        />
      </ModalRow>

      {tempGoal.goalType === GoalTypeType.SMART && <SMARTGoal />}
    </div>
  );
};
