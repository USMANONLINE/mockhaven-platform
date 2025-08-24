
export interface BaseResponse {
  code: number;
  message: string;
}

export interface BaseResponseData<T> extends BaseResponse {
  data: T;
}

export interface Login {
  userId: string;
  password: string;
}

export interface Role {
  name: string;
  isAdmin: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  userId: string;
  roles: Array<Partial<Role>>;
  privileges: Array<string>;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiryTimeInSeconds: number;
}

export interface SideBarItem {
  name?: string;
  icon: string;
  label: string;
  path?: string;
  separator: boolean;
  action?: () => Promise<void>;
}

export interface ProfileResponse {
  id: number;
  firstName: string;
  surName: string;
  otherName: string;
  emailAddress: string;
  phoneNumber: string;
  roles: Array<Partial<Role>>;
}

enum RouteAccessors {
  admin = 'admin',
  client = 'client'
}

export interface RouteMeta {
  for: RouteAccessors;
  label: string;
  icon: string;
}
