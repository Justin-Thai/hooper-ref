require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middlewares/credentials');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());

const db = require('./models');

// Routers
const subsRouter = require('./routes/Submissions');
app.use('/submissions', subsRouter);
const entriesRouter = require('./routes/Entries');
app.use('/entries', entriesRouter);
const playersRouter = require('./routes/Players');
app.use('/players', playersRouter);
const usersRouter = require('./routes/Users');
app.use('/users', usersRouter);
const authRouter = require('./routes/Auth');
app.use('/auth', authRouter);


db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
