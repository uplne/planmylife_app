import { useEffect, useRef } from "react";
import { DatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";

import { SimpleInput } from "../../SimpleInput";
import { GoalTasksTypes } from "../../../store/Goals/api";

import { useGoalsStore } from "../../../store/Goals";

type ComponentProps = {
  editMode?: boolean;
  data: GoalTasksTypes;
};

export const AddGoalTask = ({ data, editMode = false }: ComponentProps) => {
  const tempTask = useGoalsStore().tempTask;
  const setTempTask = useGoalsStore().setTempTask;
  const resetTempTask = useGoalsStore().resetTempTask;
  const LABEL = "Add task";

  const inputRef = useRef<HTMLInputElement | null>(null);

  const onChange = async (e: React.FormEvent<HTMLInputElement>) => {
    await setTempTask({ task: (e.target as HTMLInputElement).value });
  };

  useEffect(() => {
    inputRef.current?.focus();
    setTempTask({
      task: (editMode && data && data.title) || "",
      schedule: (editMode && data && data.schedule) || null,
    });

    return () => {
      resetTempTask();
    };
  }, []);

  const calendarOnClick = async (date: dayjs.Dayjs) => {
    if (date) {
      setTempTask({ schedule: date.format() });
    } else {
      setTempTask({ schedule: null });
    }
  };

  const customFormat = (value: Dayjs) => value.format("MMM D, YYYY - HH:mm");
  const customTimeFormat = "HH:mm";
  let defaultValue = null;

  return (
    <div className="taskmodal">
      <div className="taskmodal__options-wrapper">
        <h4>Task</h4>
        <SimpleInput
          value={tempTask.task}
          onChange={onChange}
          placeholder={LABEL}
        />
      </div>

      <div className="taskmodal__options-wrapper">
        <h4>Schedule Task</h4>
        <DatePicker
          format={customFormat}
          showTime={{ format: customTimeFormat }}
          onChange={calendarOnClick}
          defaultValue={defaultValue}
        />
      </div>
    </div>
  );
};
