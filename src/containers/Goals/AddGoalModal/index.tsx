import { useRef, useEffect, useState } from "react";
import { DatePicker } from "antd";
import type { RadioChangeEvent } from "antd";
import dayjs, { type Dayjs } from "dayjs";

import { SimpleInput } from "../../../components/SimpleInput";
import { TaskType, useTasksStore } from "../../../store/Tasks";
import { useModalStore } from "../../../store/Modal";
import {
  saveNewTask,
  saveEditedTask,
} from "../../../components/Tasks/tasks.controller";
import { GoalType, GoalTypeType } from "./GoalType";
import { ModalRow } from "./ModalRow";
import { SMARTGoal } from "./SMARTGoal";
import { H3 } from "../../../components/Headlines/H3";

import { TasksTypes } from "../../../types/status";
import { Category } from "./Category";

type ComponentTypes = {
  task?: TaskType | null;
  editMode?: boolean;
};

export const AddGoalModal = ({
  task = null,
  editMode = false,
}: ComponentTypes) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { newTask, updateNewTask, setSchedule } = useTasksStore();
  const { toggleSaveDisable } = useModalStore();
  const [goalType, setGoalType] = useState(GoalTypeType.SMART);

  useEffect(() => {
    inputRef.current?.focus();
    updateNewTask(editMode && task ? task.title : "");

    if (editMode) {
      toggleSaveDisable(false);
    }

    return () => {
      updateNewTask("");
      setSchedule(undefined);
    };
  }, []);

  const onChange = async (e: React.FormEvent<HTMLInputElement>) => {
    await updateNewTask((e.target as HTMLInputElement).value);

    if (!editMode) {
      await toggleSaveDisable((e.target as HTMLInputElement).value === "");
    }
  };

  const onSave = async () => {
    if (editMode && task?.taskId) {
      await saveEditedTask(task?.taskId);
    } else {
      await saveNewTask();
    }
  };

  const onKeyPress = (e: any) => {
    if (e.key === "Enter") {
      onSave();
    }
  };

  const calendarOnClick = async (date: dayjs.Dayjs) => {
    if (date) {
      setSchedule(date.format());
    } else {
      setSchedule(undefined);
    }

    if (!editMode) {
      await toggleSaveDisable(task?.schedule === date.format());
    }
  };

  const customFormat = (value: Dayjs) => value.format("MMM D, YYYY - HH:mm");
  const customTimeFormat = "HH:mm";

  let schedulerProps = null;
  let defaultValue = null;

  if (task) {
    if (
      task.type === TasksTypes.RECURRING ||
      task.type === TasksTypes.SCHEDULED_RECURRING
    ) {
      schedulerProps = {
        type: task.repeatType,
        times: task.repeatTimes,
        period: task.repeatPeriod,
      };
    }

    if (
      editMode &&
      (task.type === TasksTypes.SCHEDULE ||
        task.type === TasksTypes.SCHEDULED_RECURRING)
    ) {
      defaultValue = dayjs(task.assigned);
    }
  }

  const onChangeGoalType = (e: RadioChangeEvent) => setGoalType(e.target.value);

  return (
    <div className="w-full text-left relative" onKeyPress={onKeyPress}>
      <ModalRow>
        <H3>Type of Goal</H3>
        <GoalType onChange={onChangeGoalType} value={goalType} />
      </ModalRow>

      <ModalRow>
        <H3>Category</H3>
        <Category />
      </ModalRow>

      {goalType === GoalTypeType.SMART && <SMARTGoal />}
    </div>
  );
};
