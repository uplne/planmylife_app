import axios, { AxiosError } from "axios";

import { StatusTypes, TasksTypes } from "../../types/status";
import { CollectionType } from "../../services/firebase";

import { GoalsAPITypes, GoalTasksTypes } from "../../store/Goals/api";
import { idType } from "../../types/idtype";
import { requestErrorHandling } from "../../services/requestErrorHandling";

// export const removeTaskAPI = async (id: idType) => {
//   const storedTasks = await useTasksStore.getState().tasks;
//   const taskData = storedTasks.find((task) => task.taskId === id);
//   let collection: CollectionType = "default";

//   // It's recurring task
//   if (
//     taskData &&
//     "type" in taskData &&
//     (taskData.type === TasksTypes.RECURRING ||
//       taskData.type === TasksTypes.SCHEDULED_RECURRING)
//   ) {
//     collection = "recurring";
//   }

//   try {
//     const response = await axios.delete(
//       `http://localhost:3001/api/v1/tasks/${id}`,
//     );

//     return response;
//   } catch (error: any | AxiosError) {
//     if (axios.isAxiosError(error)) {
//       if (error.response) {
//         throw new Error(
//           `Failed to delete task: ${id}, error - response: ${error.response.status} ${error.response.data}`,
//         );
//       } else if (error.request) {
//         throw new Error(
//           `Failed to delete task: ${id}, error - request: ${error.request}`,
//         );
//       }
//     } else {
//       throw new Error(`Failed to delete task: ${id}, error: ${error.message}`);
//     }
//   }
// };

export const saveGoalTaskAPI = async (goalTask: GoalTasksTypes) => {
  try {
    const response = await axios.post(
      `http://localhost:3001/api/v1/goals/task`,
      {
        ...goalTask,
      },
    );

    return response;
  } catch (e) {
    throw new Error(`Failed to save goal task: ${goalTask.id}, error: ${e}`);
  }
};

export const getGoalTasksAPI = async (goalId: idType) => {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/v1/goals/tasks/${goalId}`,
    );

    if (response.data && response.data.length > 0) {
      return response.data;
    }

    return [];
  } catch (e) {
    throw new Error(`Get ${StatusTypes.ACTIVE} goal tasks: ${e}`);
  }
};

export const getGoalTasksForWeekAPI = async (selectedWeek: string) => {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/v1/goals/tasks-for-week/${selectedWeek}`,
    );

    if (response.data && response.data.length > 0) {
      return response.data;
    }

    return [];
  } catch (e) {
    throw new Error(`Get ${StatusTypes.ACTIVE} goal tasks: ${e}`);
  }
};

export const updateGoalTaskAPI = async (newTaskData: GoalTasksTypes) => {
  try {
    const response = await axios.put(
      `http://localhost:3001/api/v1/goals/tasks/${newTaskData.taskId}`,
      {
        ...newTaskData,
      },
    );

    return response;
  } catch (error: any | AxiosError) {
    requestErrorHandling({
      error,
      message: `Failed to update task: ${newTaskData.taskId}, error - response: `,
    });
  }
};

export const removeGoalTaskAPI = async (taskData: GoalTasksTypes) => {
  try {
    const response = await axios.delete(
      `http://localhost:3001/api/v1/goals/tasks/${taskData.taskId}`,
    );

    return response;
  } catch (error: any | AxiosError) {
    requestErrorHandling({
      error,
      message: `Failed to delete task: ${taskData.taskId}, error - response: `,
    });
  }
};
