export interface ICategoryPayload {
  name: string;
  icon?: string;
  description?: string;
}

export interface IUpdateCategoryPayload {
  name?: string;
  icon?: string;
  description?: string;
}