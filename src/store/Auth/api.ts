import { idType } from "../../types/idtype";

export interface user {
  schemas: {
    created: string;
    lastLogin: string;
    displayName: string;
    firstName: string;
    email: string;
    id: string;
  };
}
