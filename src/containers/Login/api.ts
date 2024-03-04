import axios from "axios";

import { UserTypes } from "../../store/Auth/api";
import { encrypt } from "../../services/encryption";

export const getUserById = async (userId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/v1/users/${userId}`,
    );

    if (response.data && response.data.length > 0) {
      return response.data[0];
    }

    return null;
  } catch (e) {
    throw new Error(`Get user by Id: ${e}`);
  }
};

export const saveUser = async (currentUser: Omit<UserTypes, "id">) => {
  try {
    const response = await axios.post(`http://localhost:3001/api/v1/users`, {
      ...currentUser,
      display_name: await encrypt(currentUser.display_name),
      first_name: await encrypt(currentUser.first_name),
      email: await encrypt(currentUser.email),
    });

    return response.status;
  } catch (e) {
    throw new Error(`Save user: ${e}`);
  }
};

export const saveLastLogin = async (lastLogin: string, userId: string) => {
  try {
    const response = await axios.put(
      `http://localhost:3001/api/v1/users/lastLogin`,
      {
        lastLogin,
        userId,
      },
    );

    return response.status;
  } catch (e) {
    throw new Error(`Last login update failed: ${e}`);
  }
};
