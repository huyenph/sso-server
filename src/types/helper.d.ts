type OriginNameType = {
  [key: string]: string;
};

type AllowOriginType = {
  [key: string]: boolean;
};

type SessionUserType = {
  [key: string]: UserType;
};

type SessionClientType = {
  [key: string]: string[] | string | undefined;
};

type IntermediateTokenCacheType = {
  [key: string]: string[];
};

type AppTokenDBType = {
  [key: string]: string;
};
