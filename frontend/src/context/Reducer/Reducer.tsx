import { StateType, UserType } from '../InitialState/InitalState';

export type ReducerAction =
  | { type: 'logging'; payload: { user: UserType; accessToken: string } }
  | {
      type: 'updateAcessToken';
      payload: { user: UserType; accessToken: string };
    }
  | { type: 'logout' }
  | { type: 'updateUserInfo'; payload: { name: string; email: string } }
  | { type: 'updateUserPassword'; payload: { accessToken: string } };

export const userReducer = (
  auth: StateType,
  action: ReducerAction
): StateType => {
  switch (action.type) {
    case 'logging': {
      const { user, accessToken } = action.payload;
      return {
        ...auth,
        user: user,
        accessToken: accessToken,
      };
    }
    case 'updateAcessToken': {
      // console.log(JSON.stringify(auth.accessToken));
      // console.log(action.payload);
      const { user, accessToken } = action.payload;
      return {
        ...auth,
        user: user,
        accessToken: accessToken,
      };
    }
    case 'logout': {
      return {
        ...auth,
        user: undefined,
        accessToken: undefined,
      };
    }
    case 'updateUserInfo': {
      const { name, email } = action.payload;
      return {
        ...auth,
        user: {
          ...auth.user,
          name: name !== undefined ? name : auth.user?.name,
          email: email !== undefined ? email : auth.user?.email,
        },
      };
    }
    case 'updateUserPassword': {
      const { accessToken } = action.payload;
      return {
        ...auth,
        accessToken: accessToken,
      };
    }
    default: {
      return {
        ...auth,
      };
    }
  }
};
