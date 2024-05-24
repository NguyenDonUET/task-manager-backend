const { StatusCodes } = require("http-status-codes")
const Task = require("../models/tasks.model")
const checkPermissions = require("../utils/checkPermissions")
const { CustomError } = require("../middlewares/error-handler")
const tasks = require("../db/tasks")

const createTask = async (req, res) => {
  const { name, description, status, priority, deadline } = req.body
  const task = await Task.create({
    name,
    description,
    status,
    priority,
    deadline,
    userId: req.user.userId,
  })
  res.status(StatusCodes.CREATED).json({ msg: "task was created!", task })
}

const getTasks = async (req, res) => {
  const { page = 1, limit = 6, ...restQuery } = req.query

  if (!page || !limit) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "page, limit is required")
  }
  const allTasks = await Task.find({ userId: req.user.userId })

  const tasks = await Task.find({
    userId: req.user.userId,
    ...restQuery,
  })
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })

  const count = allTasks.length
  const numberInCompletedTasks = allTasks.filter(
    (task) => task.status === Status.Pending
  ).length

  res.status(StatusCodes.OK).json({
    totalPages: Math.ceil(count / limit),
    totalItems: count,
    currentPage: +page,
    pageSize: +limit,
    tasks,
    numberInCompletedTasks,
  })
}

const getTaskById = async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user.userId,
  })
  if (!task) {
    throw new CustomError(StatusCodes.NOT_FOUND, "this task doesn't exist!")
  }

  res.status(StatusCodes.OK).json({ task })
}

const updateTask = async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user.userId,
  })
  if (!task) {
    throw new CustomError(StatusCodes.NOT_FOUND, "this task doesn't exist!")
  }

  const { name, description, status, priority, deadline } = req.body
  await Task.findByIdAndUpdate(req.params.id, {
    name,
    description,
    status,
    priority,
    deadline,
  })
  res.status(StatusCodes.OK).json({ msg: "Cập nhật thành công!" })
}

const deleteTask = async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user.userId,
  })
  if (!task) {
    throw new CustomError(StatusCodes.NOT_FOUND, "this task doesn't exist!")
  }
  await Task.findByIdAndDelete(task._id)
  res.status(StatusCodes.OK).json({ msg: "Task deleted successfully" })
}
const deleteTasks = async (req, res) => {
  await Task.deleteMany({})

  res.status(StatusCodes.OK).json({ msg: "Tasks deleted successfully" })
}
const addSampleData = async (req, res) => {
  await Task.insertMany(tasks)

  res.status(StatusCodes.CREATED).json({ message: "Tasks added successfully" })
}

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskById,
  deleteTasks,
  addSampleData,
}
