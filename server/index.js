require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middlewares/credentials');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());

const db = require('./models');

// Routers
const entriesRouter = require('./routes/Entries');
app.use('/entries', entriesRouter);
const usersRouter = require('./routes/Users');
app.use('/users', usersRouter);
const authRouter = require('./routes/Auth');
app.use('/auth', authRouter);


db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
