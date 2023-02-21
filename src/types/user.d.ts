enum UserRole {
  "admin",
  "manager",
  "developer",
  "finance",
  "sales",
  "marketing",
  "user",
}

type UserType = {
  userID: string;
  username: string;
  email: string;
  isActive: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};
