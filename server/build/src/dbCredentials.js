"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const credenciales_json_1 = __importDefault(require("./config/credenciales.json"));
const dbCredentials = credenciales_json_1.default;
exports.default = dbCredentials;
