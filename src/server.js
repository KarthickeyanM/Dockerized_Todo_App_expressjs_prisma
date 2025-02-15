import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes  from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import { initdb } from "./db.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)


app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')));

initdb();

// Define routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", 'index.html'));
});

// Use routes
app.use('/auth', authRoutes);
app.use('/todos',authMiddleware, todoRoutes);


// Start the server after the database is ready
app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
});