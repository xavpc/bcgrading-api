require('rootpath')();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// allow cors requests from any origin and with credentials
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));


const allowedOrigins = [
    "https://bcgrading.netlify.app", // Production frontend
    "http://localhost:5173", // Development frontend
  ];
  
  app.use(
    cors({
      origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps, curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg =
            "The CORS policy for this site does not allow access from the specified Origin.";
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
  );

// api routes
app.use('/accounts', require('./accounts/accounts.controller'));
app.use('/admin', require('./accounts/admins.controller'));
app.use('/registrar', require('./-registrars/registrars.controller'));
app.use('/teacher', require('./-teachers/teachers.controller'));

// ! External
app.use('/external', require("./external/externals.controller"));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));
