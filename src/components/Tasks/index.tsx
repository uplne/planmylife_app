import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";

import { Box } from "../Box";
import { SubHeading } from "../SubHeading";
import { TasksBox } from "../TasksBox";
import { Preloader } from "../Preloader";
import { PlusIcon } from "../../components/Icons/PlusIcon";
import { BasicButton } from "../../components/Buttons/BasicButton";
import { AddTask } from "./TaskModal/AddTask";
import { Task as TaskComponent } from "../Task";
import { TaskDate } from "./TaskDate";
import { TaskStatus } from "./TaskStatus";

import { TaskType } from "../../store/Tasks";
import { useWeekStore } from "../../store/Week";
import { useModalStore } from "../../store/Modal";
import {
  fetchRecurringData,
  fetchDefaultData,
  saveNewTask,
} from "./tasks.controller";
import {
  allDefaultScheduledTasksSelector,
  todayDefaultScheduledTasksSelector,
  tomorrowDefaultScheduledTasksSelector,
  otherDaysDefaultScheduledTasksSelector,
} from "../../store/Tasks/selectors/default-scheduled.selector";
import { allCompletedTasksSelector } from "../../store/Tasks/selectors/completed.selector";
import { isLoadingSelector } from "../../store/Tasks/selectors/loading.selector";
import { allDefaultTasksSelector } from "../../store/Tasks/selectors/default.selector";

import "./Tasks.css";

dayjs.extend(weekday);

type useFetchHookTypes = {
  selectedWeek: string;
};

export const useFetchDefaultTasksData = ({ selectedWeek }: useFetchHookTypes) =>
  useQuery({
    queryKey: ["tasks", selectedWeek],
    queryFn: fetchDefaultData,
    staleTime: 86400000, // set to 1 day
  });

export const useFetchRecurringTasksData = () =>
  useQuery({
    queryKey: ["recurringTasks"],
    queryFn: fetchRecurringData,
    staleTime: 86400000, // set to 1 day
  });

export const Tasks = () => {
  const isLoading = isLoadingSelector();
  const defaultActiveTasks: TaskType[] = allDefaultTasksSelector();
  const allCompletedTasks: TaskType[] = allCompletedTasksSelector();

  // const allDefaultScheduledCompleted = allDefaultScheduledCompletedTasksSelector;
  const allTodayDefaultScheduled: TaskType[] =
    todayDefaultScheduledTasksSelector();
  const allTomorrowDefaultScheduled: TaskType[] =
    tomorrowDefaultScheduledTasksSelector();
  const allOtherDaysScheduled: TaskType[] =
    otherDaysDefaultScheduledTasksSelector();

  const { selectedWeek } = useWeekStore();
  const { toggleModal } = useModalStore();

  useFetchDefaultTasksData({ selectedWeek });
  useFetchRecurringTasksData();

  const addTaskSave = async () => {
    await saveNewTask();
  };

  const openModal = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    await toggleModal({
      isOpen: true,
      content: <AddTask />,
      title: "Add Task",
      onSave: addTaskSave,
      disableAutoClose: true,
    });
  };

  return (
    <TasksBox>
      <Box>
        <SubHeading>Tasks</SubHeading>
        {isLoading && <Preloader small />}
        {!isLoading && (
          <>
            <div className="tasks__wrapper">
              {allTodayDefaultScheduled.length > 0 && (
                <div>
                  <h3 className="tasks__subtitle">Today</h3>
                  {allTodayDefaultScheduled.map((task) => {
                    return (
                      <div className="tasks__container">
                        <TaskDate task={task} />
                        <TaskComponent
                          key={String(task.taskId)}
                          id={task.taskId}
                          title={task.title}
                          status={task.status}
                          rawTaskData={task}
                        />
                        <TaskStatus task={task} />
                      </div>
                    );
                  })}
                </div>
              )}
              {allTomorrowDefaultScheduled.length > 0 && (
                <div>
                  <h3 className="tasks__subtitle">Tomorrow</h3>
                  {allTomorrowDefaultScheduled.map((task) => {
                    return (
                      <div className="tasks__container">
                        <TaskDate task={task} />
                        <TaskComponent
                          key={String(task.taskId)}
                          id={task.taskId}
                          title={task.title}
                          status={task.status}
                          rawTaskData={task}
                        />
                        <TaskStatus task={task} />
                      </div>
                    );
                  })}
                </div>
              )}
              {allOtherDaysScheduled.length > 0 && (
                <div>
                  <h3 className="tasks__subtitle">This week scheduled</h3>
                  {allOtherDaysScheduled.map((task) => {
                    return (
                      <div className="tasks__container">
                        <TaskDate task={task} />
                        <TaskComponent
                          key={String(task.taskId)}
                          id={task.taskId}
                          title={task.title}
                          status={task.status}
                          rawTaskData={task}
                        />
                        <TaskStatus task={task} />
                      </div>
                    );
                  })}
                </div>
              )}
              {defaultActiveTasks.length > 0 && (
                <>
                  <h3 className="tasks__subtitle">This week</h3>
                  {defaultActiveTasks.map((task) => (
                    <div className="tasks__container">
                      <TaskComponent
                        key={String(task.taskId)}
                        id={task.taskId}
                        title={task.title}
                        status={task.status}
                        rawTaskData={task}
                      />
                      <TaskStatus task={task} />
                    </div>
                  ))}
                </>
              )}
              <BasicButton onClick={openModal} withIcon>
                <PlusIcon />
                Add task
              </BasicButton>
              <>
                {allCompletedTasks.length > 0 && (
                  <div>
                    <h3 className="tasks__subtitle">Completed</h3>
                    {allCompletedTasks.map((task) => (
                      <div className="tasks__container">
                        <TaskDate task={task} />
                        <TaskComponent
                          key={String(task.taskId)}
                          id={task.taskId}
                          title={task.title}
                          status={task.status}
                          rawTaskData={task}
                          isCompleted
                        />
                        <TaskStatus task={task} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            </div>
          </>
        )}
      </Box>
    </TasksBox>
  );
};
