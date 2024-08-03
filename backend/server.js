const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const classRoutes = require('./routes/classRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const cors = require('cors');
const financialRoutes =require('./routes/financialsRoute')

dotenv.config();

connectDB();

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); 

app.use('/api/classes', classRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/',financialRoutes)

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
