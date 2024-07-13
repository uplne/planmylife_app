import { DatePicker } from "antd";
import dayjs from "dayjs";
import { Checkbox } from "react-aria-components";

import { SimpleInput } from "../../../../components/SimpleInput";
import { ModalRow } from "../ModalRow";
import { ModalSplit } from "../ModalSplit";
import { H3 } from "../../../../components/Headlines/H3";
import { useGoalsStore } from "../../../../store/Goals";
import { useConfirmStore } from "../../../../store/Confirm";
import { useHabitSchedulerStore } from "../../../../store/HabitScheduler";
import { GoalProgress } from "../../../../components/GoalProgress";
import { AddHabit } from "../../../../components/Goal/AddHabit";
import { GoalAssignmentTypes } from "../../../../types/status";

import "./checkbox.css";

export const SMARTGoal = () => {
  const setTempGoalByKey = useGoalsStore().setTempGoalByKey;
  const openConfirm = useConfirmStore().openConfirm;
  const resetConfirm = useConfirmStore().resetConfirm;
  const resetScheduler = useHabitSchedulerStore().resetScheduler;
  const resetHabit = useGoalsStore().resetHabit;
  const tempGoal = useGoalsStore().tempGoal;
  const isHabit = tempGoal.assignment === GoalAssignmentTypes.HABIT;
  const dataHandler = (key: string, value: any) => setTempGoalByKey(key, value);

  const date = tempGoal?.endDate ? dayjs(tempGoal.endDate) : null;

  const isHabitHandler = async (isSelected: boolean) => {
    if (!isSelected) {
      await openConfirm({
        title:
          "Removing the habit will erase it's current settings and progress.",
        subtitle: "This change is irreversible.",
        confirmLabel: "Yes, remove",
        cancelLabel: "No, keep",
        onConfirm: async () => {
          await dataHandler("assignment", GoalAssignmentTypes.DEFAULT);
          await resetHabit();
          await resetScheduler();
          await resetConfirm();
          return;
        },
      });
    } else {
      dataHandler(
        "assignment",
        isSelected ? GoalAssignmentTypes.HABIT : GoalAssignmentTypes.DEFAULT,
      );
    }
  };

  return (
    <>
      <ModalRow>
        <H3>Objective</H3>
        <SimpleInput
          value={tempGoal?.objective}
          onChange={(e) => dataHandler("objective", e.target.value)}
          placeholder="Objective"
        />
      </ModalRow>

      <ModalRow>
        <H3>Why?</H3>
        <SimpleInput
          value={tempGoal?.why}
          onChange={(e) => dataHandler("why", e.target.value)}
          placeholder="Why is this goal important to me?"
        />
      </ModalRow>

      <ModalRow>
        <ModalSplit>
          <div className="w-1/2">
            <H3>I will achieve this goal by</H3>
            <DatePicker
              className="w-full py-[7px]"
              onChange={(date) => dataHandler("endDate", date)}
              placeholder="Success Date"
              value={date}
              format="DD/MM/YYYY"
            />
          </div>
        </ModalSplit>
      </ModalRow>

      <ModalRow>
        <H3>Track progress</H3>
        <GoalProgress
          onChangeTracker={(value: number) =>
            dataHandler("progressType", Number(value))
          }
          selectedTracker={tempGoal?.progressType}
          onChangeUnits={(value: string | null) =>
            dataHandler("progressOwnUnits", value)
          }
          selectedUnits={tempGoal?.progressOwnUnits || null}
        />
      </ModalRow>

      <ModalRow>
        <H3>Convert to habit</H3>
        <div className="mb-20">
          <Checkbox isSelected={isHabit} onChange={isHabitHandler}>
            <div className="checkbox">
              <svg viewBox="0 0 18 18" aria-hidden="true">
                <polyline points="1 9 7 14 15 4" />
              </svg>
            </div>
            Is habit
          </Checkbox>
        </div>
        {isHabit && (
          <AddHabit
            data={{
              habitRepeatType: tempGoal.habitRepeatType,
              habitRepeatPeriod: tempGoal.habitRepeatPeriod,
              habitRepeatTimes: tempGoal.habitRepeatTimes,
              habitRepeatDays: tempGoal.habitRepeatDays,
              habitCompletedDays: tempGoal.habitCompletedDays,
            }}
          />
        )}
      </ModalRow>
    </>
  );
};
