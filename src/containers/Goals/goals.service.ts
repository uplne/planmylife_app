import axios, { AxiosError } from "axios";

import { StatusTypes, TasksTypes } from "../../types/status";
import { CollectionType } from "../../services/firebase";

import { GoalsAPITypes } from "../../store/Goals/api";
import { useTasksStore } from "../../store/Tasks";
import { idType } from "../../types/idtype";

export const getActiveGoalsAPI = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/v1/goals/${StatusTypes.ACTIVE}`,
    );

    if (response.data && response.data.length > 0) {
      return response.data;
    }

    return [];
  } catch (e) {
    throw new Error(`Get ${StatusTypes.ACTIVE} goals: ${e}`);
  }
};

// export const updateTaskAPI = async (newTaskData: TaskType) => {
//   let collection: CollectionType = "default";

//   // It's recurring task
//   if (
//     "type" in newTaskData &&
//     (newTaskData.type === TasksTypes.RECURRING ||
//       newTaskData.type === TasksTypes.SCHEDULED_RECURRING)
//   ) {
//     collection = "recurring";
//   }

//   try {
//     const response = await axios.put(
//       `http://localhost:3001/api/v1/tasks/${newTaskData.taskId}`,
//       {
//         ...newTaskData,
//       },
//     );

//     return response;
//   } catch (error: any | AxiosError) {
//     if (axios.isAxiosError(error)) {
//       if (error.response) {
//         throw new Error(
//           `Failed to update task: ${newTaskData.taskId}, error - response: ${error.response.status} ${error.response.data}`,
//         );
//       } else if (error.request) {
//         throw new Error(
//           `Failed to update task: ${newTaskData.taskId}, error - request: ${error.request}`,
//         );
//       }
//     } else {
//       throw new Error(
//         `Failed to update task: ${newTaskData.taskId}, error: ${error.message}`,
//       );
//     }
//   }
// };

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

export const saveGoalAPI = async (goal: GoalsAPITypes) => {
  try {
    const response = await axios.post(`http://localhost:3001/api/v1/goals`, {
      ...goal,
    });

    return response;
  } catch (e) {
    throw new Error(`Failed to save goal: ${goal.id}, error: ${e}`);
  }
};

export const updateGoalAPI = async (goal: GoalsAPITypes) => {
  try {
    const response = await axios.put(
      `http://localhost:3001/api/v1/goals/${goal.goalId}`,
      {
        ...goal,
      },
    );

    return response;
  } catch (error: any | AxiosError) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `Failed to update task: ${goal.goalId}, error - response: ${error.response.status} ${error.response.data}`,
        );
      } else if (error.request) {
        throw new Error(
          `Failed to update task: ${goal.goalId}, error - request: ${error.request}`,
        );
      }
    } else {
      throw new Error(
        `Failed to update task: ${goal.goalId}, error: ${error.message}`,
      );
    }
  }
};

export const removeGoalAPI = async (id: idType) => {
  try {
    const response = await axios.delete(
      `http://localhost:3001/api/v1/goals/${id}`,
    );

    return response;
  } catch (error: any | AxiosError) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `Failed to delete goal: ${id}, error - response: ${error.response.status} ${error.response.data}`,
        );
      } else if (error.request) {
        throw new Error(
          `Failed to delete goal: ${id}, error - request: ${error.request}`,
        );
      }
    } else {
      throw new Error(`Failed to delete goal: ${id}, error: ${error.message}`);
    }
  }
};
