import axios from "axios";

import { auth } from "../../services/firebase";
import { saveSettings, getSettings } from "./api";
import { SettingsAPITypes, TIER } from "../../store/Settings/api";

jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  headers: { authorization: "Bearer test token" },
}));

jest.mock("../../services/firebase", () => ({
  auth: {
    currentUser: {
      getIdToken: jest.fn(),
    },
  },
}));

const MOCK_SETTINGS: SettingsAPITypes = {
  weekly_email_reminder: true,
  is_first_login: false,
  tier: TIER.FREE,
  day_of_week: 0,
};

describe("SETTINGS - API", () => {
  beforeEach(() => {
    (auth.currentUser?.getIdToken as jest.Mock).mockResolvedValueOnce(
      "token123",
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("POST save settings", () => {
    it("saveSettings", async () => {
      (axios.post as jest.Mock).mockResolvedValueOnce({
        data: [{ id: "111" }],
      });

      await saveSettings({ ...MOCK_SETTINGS });

      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3001/api/v1/settings",
        {
          weekly_email_reminder: MOCK_SETTINGS.weekly_email_reminder,
          is_first_login: MOCK_SETTINGS.is_first_login,
          tier: MOCK_SETTINGS.tier,
          day_of_week: MOCK_SETTINGS.day_of_week,
        },
      );
    });
  });

  describe("GET settings", () => {
    it("getSettings", async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce("");

      await getSettings();

      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:3001/api/v1/settings",
      );
    });
  });
});
