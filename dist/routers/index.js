"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("../middleware"));
const controllers_1 = __importDefault(require("../controllers"));
const router = express_1.default.Router();
router.get("/", middleware_1.default.isAuthenticated, controllers_1.default.onAuthorized);
router.get("/login", middleware_1.default.login, controllers_1.default.renderLoginView);
router.post("/authorize", controllers_1.default.onLogin);
router.post("/token", controllers_1.default.onGetToken);
exports.default = router;
