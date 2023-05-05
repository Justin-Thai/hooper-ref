const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const db = require('./models');

// Routers
const entriesRouter = require('./routes/Entries');
app.use('/entries', entriesRouter);
const usersRouter = require('./routes/Users');
app.use('/users', usersRouter);
const authRouter = require('./routes/Auth');
app.use('/auth', authRouter);


db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001");
    });
});
