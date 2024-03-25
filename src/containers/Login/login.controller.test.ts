import { auth } from "../../services/firebase";
import axios from "axios";

import { getUserId, storeUserData, initializeApp } from "./login.controller";
import { useAuthStore } from "../../store/Auth";
import { useSettingsStateStore } from "../../store/Settings";
import { getUserById, saveLastLogin, saveUser } from "./login.service";
import { decrypt } from "../../services/encryption";
import { createSettings, fetchSettings } from "../Settings/controller";

jest.mock("../../services/firebase", () => ({
  auth: {
    currentUser: {
      getIdToken: jest.fn(),
    },
  },
}));

jest.mock("./api", () => ({
  getUserById: jest.fn(),
  saveLastLogin: jest.fn(),
  saveUser: jest.fn(),
}));

jest.mock("../../services/encryption", () => ({
  decrypt: jest.fn(),
}));

jest.mock("../Settings/controller", () => ({
  createSettings: jest.fn(),
  fetchSettings: jest.fn(),
}));

describe("LOGIN - CONTROLLER", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  test("Should hash user ID", () => {
    expect(getUserId("111")).toBe(
      "f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae",
    );
  });

  test("storeUserData - We have user in DB already", async () => {
    const USER_DATA_MOCK = {
      display_name: "Steve Vadocz",
      first_name: "Steve",
      email: "steve@awesome.com",
      user_id:
        "f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae",
      created: "some date",
      last_login: "2023-01-10T00:00:00+00:00",
    };

    jest.spyOn(useAuthStore.getState(), "updateUID");
    (auth.currentUser?.getIdToken as jest.Mock).mockImplementationOnce(
      () => "token",
    );
    (getUserById as jest.Mock).mockResolvedValueOnce(USER_DATA_MOCK);
    (saveLastLogin as jest.Mock).mockResolvedValueOnce(true);
    jest.spyOn(useAuthStore.getState(), "updateCurrentUser");
    jest.spyOn(useAuthStore.getState(), "setIsLoggedIn");
    (decrypt as jest.Mock).mockImplementation((value) => value);
    jest.useFakeTimers().setSystemTime(new Date("2023-01-10"));

    await storeUserData({
      user: {
        uid: "111",
      },
    } as any);

    expect(useAuthStore.getState().updateUID).toHaveBeenCalledWith("111");
    expect(axios.defaults.headers.common["Authorization"]).toBe("Bearer token");
    expect(getUserById).toHaveBeenCalledWith(
      "f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae",
    );
    expect(useAuthStore.getState().updateCurrentUser).toHaveBeenCalledWith({
      ...USER_DATA_MOCK,
    });
    expect(saveLastLogin).toHaveBeenCalled();
    expect(useAuthStore.getState().setIsLoggedIn).toHaveBeenCalledWith(true);

    jest.useRealTimers();
  });

  test("storeUserData - We need to create a new user", async () => {
    const USER_DATA_MOCK = {
      display_name: "Steve Vadocz",
      first_name: "Steve",
      email: "steve@awesome.com",
      user_id:
        "f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae",
      created: "2023-01-10T00:00:00+00:00",
      last_login: "2023-01-10T00:00:00+00:00",
    };

    jest.spyOn(useAuthStore.getState(), "updateUID");
    (auth.currentUser?.getIdToken as jest.Mock).mockImplementationOnce(
      () => "token",
    );
    (getUserById as jest.Mock).mockResolvedValueOnce(null);
    (saveUser as jest.Mock).mockResolvedValueOnce(true);
    jest.spyOn(useSettingsStateStore.getState(), "updateIsFirstLogin");
    jest.spyOn(useAuthStore.getState(), "updateCurrentUser");
    (createSettings as jest.Mock).mockResolvedValueOnce(true);
    jest.useFakeTimers().setSystemTime(new Date("2023-01-10"));

    await storeUserData({
      user: {
        uid: "111",
        displayName: "Steve Vadocz",
        email: "steve@awesome.com",
      },
    } as any);

    expect(useAuthStore.getState().updateUID).toHaveBeenCalledWith("111");
    expect(axios.defaults.headers.common["Authorization"]).toBe("Bearer token");
    expect(getUserById).toHaveBeenCalledWith(
      "f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae",
    );
    expect(
      useSettingsStateStore.getState().updateIsFirstLogin,
    ).toHaveBeenCalledWith(true);
    expect(useAuthStore.getState().updateCurrentUser).toHaveBeenCalledWith(
      USER_DATA_MOCK,
    );
    expect(saveUser).toHaveBeenCalledWith(USER_DATA_MOCK);
    expect(createSettings).toHaveBeenCalled();

    jest.useRealTimers();
  });

  test("storeUserData - User data fetching fails", async () => {
    jest.spyOn(useAuthStore.getState(), "updateUID");
    (auth.currentUser?.getIdToken as jest.Mock).mockImplementationOnce(
      () => "token",
    );
    (getUserById as jest.Mock).mockRejectedValueOnce("Error");

    await expect(
      storeUserData({
        user: {
          uid: "111",
        },
      } as any),
    ).rejects.toThrow("Request failed");
    expect(useAuthStore.getState().updateUID).toHaveBeenCalledWith("111");
    expect(axios.defaults.headers.common["Authorization"]).toBe("Bearer token");
    expect(getUserById).toHaveBeenCalledWith(
      "f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae",
    );
  });

  test("initializeApp - first login", async () => {
    (fetchSettings as jest.Mock).mockResolvedValueOnce(true);
    const spyRedirect = jest.fn((value) => value);
    jest.spyOn(useSettingsStateStore.getState(), "updateIsFirstLogin");

    await initializeApp(spyRedirect);

    expect(
      useSettingsStateStore.getState().updateIsFirstLogin,
    ).toHaveBeenCalledWith(false);
    expect(spyRedirect).toHaveBeenCalledWith("/myweek");
  });

  test("initializeApp - another login", async () => {
    jest.mock("../../store/Settings");

    useSettingsStateStore.getState = () =>
      ({
        is_first_login: false,
        updateIsFirstLogin: jest.fn(),
      }) as any;

    (fetchSettings as jest.Mock).mockResolvedValueOnce(true);
    const spyRedirect = jest.fn((value) => value);

    await initializeApp(spyRedirect);

    expect(
      useSettingsStateStore.getState().updateIsFirstLogin,
    ).not.toHaveBeenCalled();
    expect(spyRedirect).toHaveBeenCalledWith("/myweek");
  });
});
