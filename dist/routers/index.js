"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = __importDefault(require("../controllers"));
const router = express_1.default.Router();
router.get("/", controllers_1.default.onAuthorize);
router.get("/authorize", controllers_1.default.renderLoginView);
router.post("/signin", controllers_1.default.signin);
router.post("/token", controllers_1.default.onToken);
exports.default = router;
