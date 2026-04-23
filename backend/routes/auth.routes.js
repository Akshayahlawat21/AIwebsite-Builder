import exprss from "express"
import { googleAuth, logOut } from "../controllers/auth.controller.js"

const authRouter= exprss.Router()


authRouter.post("/google",googleAuth)
authRouter.get("/logout",logOut)

export default authRouter