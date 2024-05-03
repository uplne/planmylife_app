import { idType } from "../../types/idtype";

export interface CategoryAPITypes {
  id?: idType;
  categoryId: string;
  title: string;
}

/*
  CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    category_id TEXT,
    title TEXT,
    UNIQUE(category_id)
  );
*/
