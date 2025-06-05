import { Router } from "express";
import { sendMailController } from "../controllers/mailController";

const router = Router();

router.post("/send-mail", sendMailController);

export default router;