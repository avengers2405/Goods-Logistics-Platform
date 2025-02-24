import { User } from "@prisma/client";
import Repository from "./base.repo";

export default class UserRepository extends Repository<User> {
  constructor() {
    super("user");
  }

  public async getUserEmail(email: string) {
    const userData = await this.model.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        clerkId: true,
        phone: true,
        address: true,
      },
    });

    return userData;
  }

  public async getUserByClerkUserId(clerkUserId: string) {
    const userData = await this.model.findFirst({
      where: {
        clerkId: clerkUserId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        clerkId: true,
        phone: true,
        createdAt: true,
        credits: true,
        addresses: true,
        bookings: true,
      },
    });

    return userData;
  }
}
