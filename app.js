require("dotenv").config()
require("express-async-errors")
const cors = require("cors")
const express = require("express")
const cookieParser = require("cookie-parser")
const { errorHandlerMiddleware } = require("./middlewares/error-handler")
const connectDB = require("./db/connect")

//  routers
const authRouter = require("./routes/authRoutes")
const taskRouter = require("./routes/taskRoutes")
const userRouter = require("./routes/usersRoutes")

const app = express()
app.use(express.json())
app.use(cookieParser(process.env.JWT_REFRESH_TOKEN_SECRET))
app.use(express.urlencoded({ extended: false }))
app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "https://task-manager-reactjs.onrender.com",
    credentials: true,
  })
)

// routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/tasks", taskRouter)
app.use("/api/v1/users", userRouter)

app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 5000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(PORT, () =>
      console.log(`Server is listening on PORT ${PORT}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
