import { useRef, useEffect } from "react";
import { DatePicker } from "antd";
import { type Dayjs } from "dayjs";

import { Scheduler } from "../../../components/TaskScheduler";
import { SimpleInput } from "../../SimpleInput";
import { TaskType, useTasksStore } from "../../../store/Tasks";
import { useModalStore } from "../../../store/Modal";
import { saveNewTask } from "../controller";

import "./TaskModal.css";

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

    return () => {
      updateNewTask("");
      setSchedule(undefined);
    };
  }, []);

  const onChange = async (e: React.FormEvent<HTMLInputElement>) => {
    await updateNewTask((e.target as HTMLInputElement).value);
    await toggleSaveDisable((e.target as HTMLInputElement).value === "");
  };

  const onSave = async () => {
    if (editMode) {
      // dispatch({
      //   type: 'tasks/saveEditedTask',
      //   payload: task,
      // });
    } else {
      await saveNewTask();
    }
  };

  const onKeyPress = (e: any) => {
    if (e.key === "Enter") {
      onSave();
    }
  };

  const calendarOnClick = () => {
    // if (date) {
    //   dispatch(setSchedule(date.format()));
    // } else {
    //   dispatch(setSchedule(null));
    // }
    // dispatch({
    //   type: 'modal/toggleSaveDisable',
    //   payload: task.schedule === date.toISOString(),
    // });
  };

  const customFormat = (value: Dayjs) => value.format("MMM D, YYYY - HH:mm");
  const customTimeFormat = "HH:mm";

  // if (task.type === TASK_TYPE.RECURRING) {
  //   schedulerProps = {
  //     type: task.repeatType,
  //     times: task.repeatTimes,
  //     period: task.repeatPeriod,
  //   };
  // }

  // let SCHEDULER_OPTIONS = [{
  //   title: 'day',
  //   options: [1,1,1,1,1,1,1],
  // },
  // {
  //   title: 'working day',
  //   options: [1,1,1,1,1,0,0]
  // },
  // {
  //   title: 'selected day',
  //   options: [0,0,0,0,0,0,0],
  // }];

  // const calendarPickerProps = editMode && 'date' in task ? {
  //   defaultValue: moment(task.date),
  // } : {};

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
          // {...calendarPickerProps}
        />
      </div>

      <div className="taskmodal__options-wrapper">
        <h4>Repeat Task</h4>
        <Scheduler />
      </div>
    </div>
  );
};
