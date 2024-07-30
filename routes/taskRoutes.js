const express = require('express')
const router = express.Router()
const {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  deleteTasks,
  getTaskById,
  addSampleData,
} = require('../controllers/taskController')
const { isAuthorized } = require('../middlewares/authentication')

router.delete('/reset', deleteTasks)
router.post('/import', addSampleData)

router.route('/').get(isAuthorized, getTasks).post(isAuthorized, createTask)

router
  .route('/:id')
  .get(isAuthorized, getTaskById)
  .patch(isAuthorized, updateTask)
  .delete(isAuthorized, deleteTask)

module.exports = router
