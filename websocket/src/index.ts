import http from "http";
import Redis from "ioredis";
import dotenv from "dotenv";
import express from "express";
import { Server as SockerIOServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

dotenv.config();

export class TrackingServer {
  private app: express.Application;
  private server: http.Server;
  private io: SockerIOServer;
  private pubClient: Redis;
  private subClient: Redis;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.pubClient = new Redis(process.env.REDIS_URL!);
    this.subClient = new Redis(process.env.REDIS_URL!);

    this.io = new SockerIOServer(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      adapter: createAdapter(this.pubClient, this.subClient),
    });

    this.setupSocketHandlers();
    this.setupRedisSubscriptions();
  }

  private setupSocketHandlers(): void {
    this.io.on("connection", (socket) => {
      console.log(`New client connected: ${socket.id}`);

      // client subscribes to the channel with bookingId
      socket.on("subscribe", (bookingId: string) => {
        socket.join(`tracking:${bookingId}`);
        console.log(`Client ${socket.id} subscribed to tracking:${bookingId}`);
      });

      // client unsubscribes from the channel with bookingId
      socket.on("unsubscribe", (bookingId: string) => {
        socket.leave(`tracking:${bookingId}`);
        console.log(
          `Client ${socket.id} unsubscribed from tracking:${bookingId}`
        );
      });

      // event used to update the location
      socket.on(
        "updateLocation",
        async (data: {
          driverId: string;
          bookingId: string;
          location: {
            latitude: number;
            longitude: number;
          };
        }) => {
          try {
            socket.emit("locationUpdated", { success: true });
          } catch (error) {
            console.log("Error: ", error);
            socket.emit("locationUpdated", {
              success: false,
              error: "Failed to update location",
            });
          }
        }
      );

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  private setupRedisSubscriptions(): void {
    // subscribe to tracking:location channel
    const locationChannel = this.subClient.duplicate();
    locationChannel.subscribe("tracking:location");

    locationChannel.on("message", (channel, message) => {
      if (channel === "tracking:location") {
        try {
          const data = JSON.parse(message);
          this.io.to(`tracking:${data.bookingId}`).emit("locationUpdate", data);
        } catch (error) {
          console.error("Error location update", error);
        }
      }
    });
  }

  public start(port: number): void {
    this.server.listen(port, () => {
      console.log(`Websocket tracking server running on port ${port}`);
    });
  }
}

const trackingServer = new TrackingServer();
trackingServer.start(3003);
