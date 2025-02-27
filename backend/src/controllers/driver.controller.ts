import { Request, Response } from "express";
import { GET, POST } from "../decorator/router";
import { APIResponse } from "../interface/api";
import DriverRepository from "../repository/driver.repo";
import { HTTPStatus } from "../constant";
import { CreateDriverSchema, CreateVehicleSchema } from "../types";

export default class DriverClass {
  private driverRepository: DriverRepository;

  constructor() {
    this.driverRepository = new DriverRepository();
  }

  @POST("/api/v1/driver")
  public async createDriver(
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

      const parsedData = CreateDriverSchema.safeParse(req.body);
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

      const createDriverData = this.driverRepository.create(parsedData);
      return res.status(HTTPStatus.CREATED).json({
        status: true,
        message: "Driver created successfully",
        data: createDriverData,
      });
    } catch (error) {
      console.error("Error saving driver:", error);
      return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Failed to saving driver data",
      });
    }
  }

  @GET("/api/v1/driver/:driverId")
  public async getDriverData(
    req: Request,
    res: Response
  ): Promise<Response<APIResponse>> {
    try {
      const { driverId } = req.params;
      if (!driverId) {
        return res.status(HTTPStatus.BAD_REQUEST).json({
          status: false,
          message: "driverId is required",
        });
      }
      const driverData = await this.driverRepository.get(driverId as string);
      if (!driverData) {
        return res.status(HTTPStatus.NOT_FOUND).json({
          status: false,
          message: "Driver not found",
        });
      }

      return res.status(HTTPStatus.OK).json({
        status: true,
        message: "Driver data retrieved successfully",
        data: driverData,
      });
    } catch (error) {
      console.error("Error retrieving driver:", error);
      return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Failed to retrieve driver data",
      });
    }
  }
}
