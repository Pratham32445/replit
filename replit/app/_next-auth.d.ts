import "next-auth";

declare module "next-auth" {
  interface User {
    isVerified?: boolean;
  }
  
  interface Session {
    user?: User;
  }
}

