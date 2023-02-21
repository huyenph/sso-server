import express, { Router } from "express";
import controller from "../controllers";

const router: Router = express.Router();

router.get("/", controller.onAuthorize);

router.get("/authorize", controller.renderLoginView);

router.post("/signin", controller.onSignin);

router.post("/token", controller.onToken);

export default router;
