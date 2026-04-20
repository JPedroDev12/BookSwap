import { Router } from "express"
import { createUserPage, getUserPage, updateUserPage } from "../Controller/userPageController"

const router = Router()

router.get('/:user_id', getUserPage)
router.post('/', createUserPage)
router.put('/:id', updateUserPage)

export default router;