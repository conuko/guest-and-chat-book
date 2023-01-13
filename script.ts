import { Prisma } from "@prisma/client";

import prisma from "./libs/prisma";

// 1

export const createUser = async (user: Prisma.UserCreateInput) => {
  // 2 & 3

  return await prisma.user.create({
    data: user,
  });
};
