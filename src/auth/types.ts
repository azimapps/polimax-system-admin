export type UserType = Record<string, any> | null;

export type AuthState = {
  user: UserType;
  loading: boolean;
};

export type AuthContextValue = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
  login: (payload: Record<string, any>) => Promise<void>;
  staffLogin: (payload: Record<string, any>) => Promise<void>;
  phoneLogin: (payload: Record<string, any>) => Promise<void>;
  omborLogin: (payload: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: UserType) => void;
};
