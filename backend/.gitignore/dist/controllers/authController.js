"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("../config/database"));
const jwt_1 = require("../utils/jwt");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }
        const result = await database_1.default.query("SELECT id, name, email, password_hash, role FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const user = result.rows[0];
        const passwordMatch = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const token = (0, jwt_1.generateToken)(user.id, user.role);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const result = await database_1.default.query(`SELECT id, name, email, role
       FROM users
       WHERE id = $1`, [req.user.userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Get user error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getMe = getMe;
