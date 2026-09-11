"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is required",
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
exports.authenticate = authenticate;
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action",
            });
        }
        next();
    };
};
exports.authorize = authorize;
