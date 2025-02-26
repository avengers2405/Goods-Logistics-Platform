import { Request, Response } from "express";
import { GET, POST } from "../decorator/router";
import { APIResponse } from "../interface/api";
import UserRepository from "../repository/user.repo";
import { HTTPStatus } from "../constant";
import { CreateUserSchema } from "../types";

export default class UserController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  @POST("/api/v1/user")
  public async createUser(
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

      const parsedData = CreateUserSchema.safeParse(req.body);
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

      const createUserData = this.userRepository.create(parsedData);
      return res.status(HTTPStatus.CREATED).json({
        status: true,
        message: "User created successfully",
        data: createUserData,
      });
    } catch (error) {
      console.error("Error saving user:", error);
      return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Failed to saving user data",
      });
    }
  }

  @GET("/api/v1/user:clerkUserId")
  public async getUserData(
    req: Request,
    res: Response
  ): Promise<Response<APIResponse>> {
    try {
      const { clerkUserId } = req.params;
      if (!clerkUserId) {
        return res.status(HTTPStatus.BAD_REQUEST).json({
          status: false,
          message: "clerkUserId is required",
        });
      }
      const userData = await this.userRepository.getUserByClerkUserId(
        clerkUserId as string
      );
      if (!userData) {
        return res.status(HTTPStatus.NOT_FOUND).json({
          status: false,
          message: "User not found",
        });
      }

      return res.status(HTTPStatus.OK).json({
        status: true,
        message: "User data retrieved successfully",
        data: userData,
      });
    } catch (error) {
      console.error("Error retrieving user:", error);
      return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Failed to retrieve user data",
      });
    }
  }
}
