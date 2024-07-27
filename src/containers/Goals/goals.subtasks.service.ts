import axios, { AxiosError } from "axios";

import { StatusTypes, TasksTypes } from "../../types/status";
import { CollectionType } from "../../services/firebase";

import { GoalSubTasksTypes } from "../../store/Goals/api";
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

export const saveGoalSubTaskAPI = async (newTasks: GoalSubTasksTypes[]) => {
  try {
    const response = await axios.post(
      `http://localhost:3001/api/v1/goals/subtasks`,
      {
        subtasks: newTasks,
      },
    );

    return response;
  } catch (e) {
    throw new Error(`Failed to save goal subtasks - error: ${e}`);
  }
};

export const updateGoalSubTaskAPI = async (newTaskData: GoalSubTasksTypes) => {
  try {
    const response = await axios.put(
      `http://localhost:3001/api/v1/goals/subtasks/${newTaskData.subtaskId}`,
      {
        ...newTaskData,
      },
    );

    return response;
  } catch (error: any | AxiosError) {
    requestErrorHandling({
      error,
      message: `Failed to update subtask: ${newTaskData.subtaskId}, error - response: `,
    });
  }
};

export const updateGoalSubTaskInBulkAPI = async (
  subtasks: GoalSubTasksTypes[],
) => {
  try {
    const response = await axios.put(
      `http://localhost:3001/api/v1/goals/subtasks`,
      {
        subtasks,
      },
    );

    return response;
  } catch (error: any | AxiosError) {
    requestErrorHandling({
      error,
      message: `Failed to update subtasks, error - response: `,
    });
  }
};

export const removeGoalSubTaskAPI = async (taskData: GoalSubTasksTypes) => {
  try {
    const response = await axios.delete(
      `http://localhost:3001/api/v1/goals/subtasks/${taskData.subtaskId}`,
    );

    return response;
  } catch (error: any | AxiosError) {
    requestErrorHandling({
      error,
      message: `Failed to delete subtask: ${taskData.subtaskId}, error - response: `,
    });
  }
};
