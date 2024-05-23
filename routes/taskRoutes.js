const express = require("express")
const router = express.Router()
const {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  deleteTasks,
  getTaskById,
  addSampleData,
} = require("../controllers/taskController")
const { authenticateUser } = require("../middlewares/authentication")

router.delete("/reset", deleteTasks)
router.post("/import", addSampleData)

router
  .route("/")
  .get(authenticateUser, getTasks)
  .post(authenticateUser, createTask)

router
  .route("/:id")
  .get(authenticateUser, getTaskById)
  .patch(authenticateUser, updateTask)
  .delete(authenticateUser, deleteTask)

module.exports = router
