import { Booking } from "@prisma/client";
import Repository from "./base.repo";

export default class BookingRepository extends Repository<Booking> {
  constructor() {
    super("booking");
  }

  public async getDriverBookings(driverId: string, limit: number, offset: number) {
    return await this.model.findMany({
      where: {
        driverId: driverId
      },
      include: {
        user: true,
        goodsDetails: true,
        price: true,
        pickupLocation: true,
        dropoffLocation: true,
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  public async getUserBookings(userId: string, limit: number, offset: number) {
    return await this.model.findMany({
      where: {
        userId: userId
      },
      include: {
        driver: true,
        goodsDetails: true,
        price: true,
        pickupLocation: true,
        dropoffLocation: true,
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc'
      }
    });  
  }
}