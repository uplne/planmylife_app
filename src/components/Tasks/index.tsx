import { useQuery } from "@tanstack/react-query";

import { Box } from "../Box";
import { SubHeading } from "../SubHeading";
import { TasksBox } from "../TasksBox";
import { Preloader } from "../Preloader";
import { PlusIcon } from "../../components/Icons/PlusIcon";
import { BasicButton } from "../../components/Buttons/BasicButton";
import { AddTask } from "./TaskModal/AddTask";
import { Task as TaskComponent } from "../Task";

import { useTasksStore, TaskType } from "../../store/Tasks";
import { useWeekStore } from "../../store/Week";
import { useModalStore } from "../../store/Modal";
import { fetchDefaultData, saveNewTask } from "./controller";
import { DATA_FETCHING_STATUS, TasksTypes } from "../../types/status";

import "./Tasks.css";

type useFetchHookTypes = {
  selectedWeek: string;
};

export const useFetchData = ({ selectedWeek }: useFetchHookTypes) =>
  useQuery({
    queryKey: ["tasks", selectedWeek],
    queryFn: fetchDefaultData,
  });

export const Tasks = () => {
  const { isLoading } = useTasksStore();
  const defaultActiveTasks: TaskType[] = useTasksStore((state) =>
    state.defaultTasksSelector(),
  );
  const allCompletedTasks: TaskType[] = useTasksStore((state) =>
    state.allCompletedTasks(),
  );

  const { selectedWeek } = useWeekStore();
  const { toggleModal } = useModalStore();
  useFetchData({ selectedWeek });
  const loading = isLoading !== DATA_FETCHING_STATUS.LOADED;

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
        {loading && <Preloader small />}
        {!loading && (
          <>
            <div className="tasks__wrapper">
              {defaultActiveTasks.length > 0 && (
                <>
                  <h3 className="tasks__subtitle">This week</h3>
                  {defaultActiveTasks.map((task) => (
                    <div className="tasks__container">
                      <TaskComponent
                        key={String(task.id)}
                        id={task.id}
                        title={task.title}
                        status={task.status}
                        rawTaskData={task}
                      />
                      {/* {task.moved && <TaskIndicator moved />}
                      {isRecurringTask(task.type) &&
                        <TaskIndicator recurring={getRecurring(task)} isInactive={task.isInactive} />
                      } */}
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
                      <>
                        {/* {task.type === TasksTypes.SCHEDULE || task.type === TasksTypes.SCHEDULED_RECURRING &&
                          <div className="tasks__container tasks__container--with-date">
                            <div className="tasks__date tasks__date--completed">
                              {getDisplayDate(task)}
                            </div>
                            <Row
                              key={task.id}
                              id={task.id}
                              task={task.title}
                              state={TASK_STATE.COMPLETED}
                              raw={task}
                            />
                            {isRecurringTask(task.type) &&
                              <TaskIndicator recurring={getRecurring(task)} isInactive={task.isInactive} />
                            }
                          </div>
                        } */}
                        {task.type !== TasksTypes.SCHEDULE &&
                          task.type !== TasksTypes.SCHEDULED_RECURRING && (
                            <div className="tasks__container">
                              <TaskComponent
                                key={String(task.id)}
                                id={task.id}
                                title={task.title}
                                status={task.status}
                                rawTaskData={task}
                              />
                              {/* {task.moved && <TaskIndicator moved />}
                            {isRecurringTask(task.type) &&
                              <TaskIndicator recurring={getRecurring(task)} isInactive={task.isInactive} />
                            } */}
                            </div>
                          )}
                      </>
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
