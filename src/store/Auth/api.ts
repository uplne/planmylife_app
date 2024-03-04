export interface UserTypes {
  created: string;
  last_login: string;
  display_name: string;
  first_name: string;
  email: string;
  id?: string;
  user_id: string;
}

/*
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id TEXT,
    created TEXT,
    last_login TEXT,
    display_name TEXT,
    first_name TEXT,
    email TEXT,
  );
*/
