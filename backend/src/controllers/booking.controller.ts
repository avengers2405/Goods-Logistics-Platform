import { Request, Response } from "express";
import { GET, POST } from "../decorator/router";
import { APIResponse } from "../interface/api";
import BookingRepository from "../repository/booking.repo";
import { HTTPStatus } from "../constant";
import { CreateBookingSchema, GetAllBookingsQuerySchema } from "../types";
import { parse } from "path";

export default class BookingController {
  private bookingRepository: BookingRepository;

  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  @POST("api/v1/booking")
  public async createBooking(
    req: Request,
    res: Response
  ): Promise<Response<APIResponse>> {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(HTTPStatus.BAD_REQUEST).json({
          status: false,
          message: "Request body is empty",
        });
      }

      const parsedData = CreateBookingSchema.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(HTTPStatus.BAD_REQUEST).json({
          status: false,
          message: "Invalid input data",
          error: parsedData.error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }

      const createBookingData = this.bookingRepository.create(parsedData);
      return res.status(HTTPStatus.CREATED).json({
        status: true,
        message: "Booking created successfully",
        data: createBookingData,
      });
    } catch (error) {
      console.error("Error saving booking:", error);
      return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Failed to saving booking data",
      });
    }
  }

  @GET("/api/v1/booking/:bookingId")
  public async getBookingData(
    req: Request,
    res: Response
  ): Promise<Response<APIResponse>> {
    try {
      const { bookingId } = req.params;
      if (!bookingId) {
        return res.status(HTTPStatus.BAD_REQUEST).json({
          status: false,
          message: "bookingId is required",
        });
      }

      const bookingData = await this.bookingRepository.get(bookingId as string);
      if (!bookingData) {
        return res.status(HTTPStatus.NOT_FOUND).json({
          status: false,
          message: "Booking not found",
        });
      }

      return res.status(HTTPStatus.OK).json({
        status: true,
        message: "Booking data retrieved successfully",
        data: bookingData,
      });
    } catch (error) {
      console.error("Error retrieving booking:", error);
      return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Failed to retrieve booking data",
      });
    }
  }

  @GET("/api/v1/booking/driver/:driverId")
  public async getBookingsByDriver(
    req: Request,
    res: Response
  ): Promise<Response<APIResponse>> {
    try {
      const { driverId } = req.params;
      const parsedQueryParams = GetAllBookingsQuerySchema.safeParse(req.query);
      const limit = parsedQueryParams.success
        ? parsedQueryParams.data.limit
        : 50;
      const offset = parsedQueryParams.success
        ? parsedQueryParams.data.offset
        : 0;

      if (!driverId) {
        return res.status(HTTPStatus.BAD_REQUEST).json({
          status: false,
          message: "driverId is required",
        });
      }

      const bookingsData = await this.bookingRepository.getDriverBookings(
        driverId,
        limit,
        offset
      );
      if (!bookingsData) {
        return res.status(HTTPStatus.NOT_FOUND).json({
          status: false,
          message: "Bookings could not be fetched.",
        });
      }

      return res.status(HTTPStatus.OK).json({
        status: true,
        message: "Booking data retrieved successfully",
        data: bookingsData,
      });
    } catch (error) {
      console.error("Error retrieving bookings:", error);
      return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Failed to retrieve bookings data",
      });
    }
  }

  @GET("/api/v1/booking/user/:userId")
  public async getBookingsByUser(
    req: Request,
    res: Response
  ): Promise<Response<APIResponse>> {
    try {
      const { userId } = req.params;
      const parsedQueryParams = GetAllBookingsQuerySchema.safeParse(req.query);
      const limit = parsedQueryParams.success
        ? parsedQueryParams.data.limit
        : 50;
      const offset = parsedQueryParams.success
        ? parsedQueryParams.data.offset
        : 0;

      if (!userId) {
        return res.status(HTTPStatus.BAD_REQUEST).json({
          status: false,
          message: "userId is required",
        });
      }

      const bookingsData = await this.bookingRepository.getUserBookings(
        userId,
        limit,
        offset
      );
      if (!bookingsData) {
        return res.status(HTTPStatus.NOT_FOUND).json({
          status: false,
          message: "Bookings could not be fetched.",
        });
      }

      return res.status(HTTPStatus.OK).json({
        status: true,
        message: "Booking data retrieved successfully",
        data: bookingsData,
      });
    } catch (error) {
      console.error("Error retrieving bookings:", error);
      return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Failed to retrieve bookings data",
      });
    }
  }
}