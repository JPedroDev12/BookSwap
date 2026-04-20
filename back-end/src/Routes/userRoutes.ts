import { Router } from "express";
import { GetUsers, CreateUser, DeleteUser, GetUserById, UpdateUser } from "../Controller/userController";

const router = Router()

router.get('/', GetUsers)
router.get('/:id', GetUserById)
router.post('/', CreateUser)
router.put('/:id', UpdateUser)
router.delete('/:id', DeleteUser)

export default router;