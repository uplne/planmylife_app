import axios from "axios";

import { auth } from "../../services/firebase";
import { getUserById, saveUser } from "./login.service";
import { UserTypes } from "../../store/Auth/api";
import { useAuthStore, AuthDefault } from "../../store/Auth";
import { encrypt } from "../../services/encryption";

jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock("../../services/firebase", () => ({
  auth: {
    currentUser: {
      getIdToken: jest.fn(),
    },
  },
}));

jest.mock("../../services/encryption", () => ({
  encrypt: jest.fn(),
}));

describe("LOGIN - API", () => {
  beforeEach(() => {
    (auth.currentUser?.getIdToken as jest.Mock).mockResolvedValueOnce(
      "token123",
    );

    useAuthStore.getState = () => ({
      ...AuthDefault,
      uid: "jchdsrCFOgSrRQiC3rJrhPaZs1A3",
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("GET user", () => {
    it("GET user with ID", async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: [{ id: "111" }] });

      const result = await getUserById("id123");

      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:3001/api/v1/users/id123",
      );
      expect(result).toEqual({ id: "111" });
    });

    it("GET user with ID - return null if no data", async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: undefined });

      const result = await getUserById("id123");

      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:3001/api/v1/users/id123",
      );
      expect(result).toBe(null);
    });
  });

  describe("CREATE user", () => {
    it("POST user", async () => {
      const MOCKED_USER: Omit<UserTypes, "id"> = {
        created: "",
        last_login: "",
        display_name: "Steve Johson",
        first_name: "Steve",
        email: "steve@example.com",
        user_id: "userID1111",
      };
      (axios.post as jest.Mock).mockResolvedValueOnce({ status: 200 });
      (encrypt as jest.Mock).mockImplementation((value) => value);

      const result = await saveUser(MOCKED_USER);

      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3001/api/v1/users",
        {
          ...MOCKED_USER,
        },
      );
      expect(result).toBe(200);
    });

    it("GET user with ID - return null if no data", async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: undefined });

      const result = await getUserById("id123");

      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:3001/api/v1/users/id123",
      );
      expect(result).toBe(null);
    });
  });
});
