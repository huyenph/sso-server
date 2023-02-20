enum UserRole {
  "Admin",
  "Tier1",
  "Tier2",
  "Tier3",
}

type UserType = {
  userId: string;
  username: string;
  email: string;
  role: UserRole;
};
