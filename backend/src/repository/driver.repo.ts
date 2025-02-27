import { Driver } from "@prisma/client";
import Repository from "./base.repo";

export default class DriverRepository extends Repository<Driver> {
  constructor() {
    super("driver");
  }

  public async getDriverByEmail(email: String) {
    return await this.model.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        clerkId: true,
      },
    });
  }

  public async updateDriverDetails(
    driverId: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    phone?: string,
    vehicleId?: string
  ) {
    return await this.model.update({
      where: {
        id: driverId,
      },
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        vehicleId: vehicleId,
      },
    });
  }
}
