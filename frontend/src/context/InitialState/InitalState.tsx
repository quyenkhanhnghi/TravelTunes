export type UserType = {
  name?: string;
  photo?: string;
  role?: string;
  email?: string;
};

export interface StateType {
  user?: UserType;
  accessToken?: string;
}

export const InitalState: StateType = {};
