import express, { Router } from "express";
import middleware from "../middleware";
import controller from "../controllers";

const router: Router = express.Router();

router.get("/", middleware.isAuthenticated, controller.onAuthorized);

router.get("/login", middleware.login, controller.renderLoginView);

router.get("/authorize", controller.onLogin);

router.post("/token", controller.onGetToken);

export default router;
