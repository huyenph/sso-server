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
  userId: string;
  username: string;
  email: string;
  role: UserRole;
};
