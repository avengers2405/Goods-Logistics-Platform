"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingServer = void 0;
const http_1 = __importDefault(require("http"));
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
dotenv_1.default.config();
class TrackingServer {
    constructor() {
        this.app = (0, express_1.default)();
        this.server = http_1.default.createServer(this.app);
        this.pubClient = new ioredis_1.default(process.env.REDIS_URL);
        this.subClient = new ioredis_1.default(process.env.REDIS_URL);
        this.io = new socket_io_1.Server(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
            adapter: (0, redis_adapter_1.createAdapter)(this.pubClient, this.subClient),
        });
        this.setupSocketHandlers();
        this.setupRedisSubscriptions();
    }
    setupSocketHandlers() {
        this.io.on("connection", (socket) => {
            console.log(`New client connected: ${socket.id}`);
            // client subscribes to the channel with bookingId
            socket.on("subscribe", (bookingId) => {
                socket.join(`tracking:${bookingId}`);
                console.log(`Client ${socket.id} subscribed to tracking:${bookingId}`);
            });
            // client unsubscribes from the channel with bookingId
            socket.on("unsubscribe", (bookingId) => {
                socket.leave(`tracking:${bookingId}`);
                console.log(`Client ${socket.id} unsubscribed from tracking:${bookingId}`);
            });
            // event used to update the location
            socket.on("updateLocation", (data) => __awaiter(this, void 0, void 0, function* () {
                try {
                    socket.emit("locationUpdated", { success: true });
                }
                catch (error) {
                    console.log("Error: ", error);
                    socket.emit("locationUpdated", {
                        success: false,
                        error: "Failed to update location",
                    });
                }
            }));
            socket.on("disconnect", () => {
                console.log(`Client disconnected: ${socket.id}`);
            });
        });
    }
    setupRedisSubscriptions() {
        // subscribe to tracking:location channel
        const locationChannel = this.subClient.duplicate();
        locationChannel.subscribe("tracking:location");
        locationChannel.on("message", (channel, message) => {
            if (channel === "tracking:location") {
                try {
                    const data = JSON.parse(message);
                    this.io.to(`tracking:${data.bookingId}`).emit("locationUpdate", data);
                }
                catch (error) {
                    console.error("Error location update", error);
                }
            }
        });
    }
    start(port) {
        this.server.listen(port, () => {
            console.log(`Websocket tracking server running on port ${port}`);
        });
    }
}
exports.TrackingServer = TrackingServer;
const trackingServer = new TrackingServer();
trackingServer.start(3003);
