import { useRef, useEffect } from "react";
import { DatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";

import { Scheduler } from "../../../components/TaskScheduler";
import { SimpleInput } from "../../SimpleInput";
import { TaskType, useTasksStore } from "../../../store/Tasks";
import { useModalStore } from "../../../store/Modal";
import { saveNewTask, saveEditedTask } from "../tasks.controller";

import "./TaskModal.css";
import { TasksTypes } from "../../../types/status";

type ComponentTypes = {
  task?: TaskType | null;
  editMode?: boolean;
};

export const AddTask = ({ task = null, editMode = false }: ComponentTypes) => {
  const LABEL = "Add task";
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { newTask, updateNewTask, setSchedule } = useTasksStore();
  const { toggleSaveDisable } = useModalStore();

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
      (task.type === TasksTypes.SCHEDULED ||
        task.type === TasksTypes.SCHEDULED_RECURRING)
    ) {
      defaultValue = dayjs(task.assigned);
    }
  }

  return (
    <div className="taskmodal" onKeyPress={onKeyPress}>
      <div className="taskmodal__options-wrapper">
        <h4>Task</h4>
        <SimpleInput value={newTask} onChange={onChange} placeholder={LABEL} />
      </div>
      <div className="taskmodal__options-wrapper">
        <h4>Schedule Task</h4>
        {editMode && task?.schedule && (
          <p>Changing schedule will create a new task</p>
        )}
        <DatePicker
          format={customFormat}
          showTime={{ format: customTimeFormat }}
          onChange={calendarOnClick}
          defaultValue={defaultValue}
        />
      </div>

      <div className="taskmodal__options-wrapper">
        <h4>Repeat Task</h4>
        <Scheduler
          type={task?.repeatType}
          period={task?.repeatPeriod}
          times={task?.repeatTimes}
        />
      </div>
    </div>
  );
};
