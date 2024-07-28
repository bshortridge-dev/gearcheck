import { Prisma } from "@prisma/client";

declare module "@prisma/client" {
  interface CharacterWhereInput {
    className?: string;
  }
}
