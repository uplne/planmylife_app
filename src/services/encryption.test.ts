import { decrypt, encrypt } from "./encryption";
import { useAuthStore, AuthDefault } from "../store/Auth";

jest.mock("../store/auth");

describe("Encryption", () => {
  beforeEach(() => {
    useAuthStore.getState = () => ({
      ...AuthDefault,
      uid: "jchdsrCFOgSrRQiC3rJrhPaZs1A3",
    });
  });

  test("Encrypt", async () => {
    const result = await encrypt("Test");

    expect(result.includes("encrypted_")).toBeTruthy();
  });

  test("Decrypt", async () => {
    const result = await decrypt(
      "encrypted_U2FsdGVkX18KL1Kv7gRXdjvdvcl8YpeDQJRO2QPfirE=",
    );

    expect(result).toBe("Steve");
  });
});
