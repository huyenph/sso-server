type UserRole =
  | "admin"
  | "manager"
  | "developer"
  | "finance"
  | "sales"
  | "marketing"
  | "user";

type UserType = {
  userID: string;
  username: string;
  email: string;
  isActive: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

type UserAttributes = {
  userID: number;
  username: string;
  password: string;
  email: string;
  isActive: boolean;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
};

// userID is optional
type UserCreationAttributes = Optional<UserAttributes, "userID">;

// interface UserModelOutput extends Required<UserModelAttributes> {}
