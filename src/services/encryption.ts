import CryptoES from "crypto-es";

import { useAuthStore } from "../store/Auth";

export const encrypt = async (value: string) => {
  const uid = await useAuthStore.getState().uid;

  if (!uid) {
    throw new Error("Encrypting failed. No key.");
  }

  return `encrypted_${CryptoES.AES.encrypt(value, uid.toString())}`;
};

export const decrypt = async (value: string) => {
  const uid = await useAuthStore.getState().uid;

  if (!uid) {
    throw new Error("Encrypting failed. No key.");
  }

  return CryptoES.AES.decrypt(
    value.replace(/^encrypted_/, "").toString(),
    uid.toString(),
  ).toString(CryptoES.enc.Utf8);
};
