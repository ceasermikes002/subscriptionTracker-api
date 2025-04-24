import express from "express";
import cookieParser from "cookie-parser";
import { PORT } from "./config/env.js";
import subscriptionRouter from "./routes/subscription.route.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import workflowRouter from "./routes/workflow.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());  
app.use(arcjetMiddleware);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Welcome to the subscription tracker api");
});

app.listen(PORT,  async () => {
  console.log(`Subscription tracker api is running on port ${PORT}`);
  await connectToDatabase();
});

app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/workflows", workflowRouter);

app.use(errorMiddleware);

export default app;

