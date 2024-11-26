"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const DB_1 = __importDefault(require("./config/DB"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
DB_1.default;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ origin: ["http://localhost:5173", "https://link-sharing-project.vercel.app"], credentials: true }));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
app.use("/users", userRoutes_1.default);
