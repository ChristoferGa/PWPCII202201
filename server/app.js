import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import aboutRouter from './routes/about';

import Webpack from 'webpack';
import WebpackDevMidddleware from 'webpack-dev-middleware';
import WebpackHotMidddleware from 'webpack-hot-middleware';
import WebpackDevConfig from '../webpack.dev.config';

// Consultar el modo en que se esta ejecutando la aplicación
const env = process.env.NODE_ENV || 'development';

var app = express();

// Se crea la aplicación express
if (env === 'development') {
  console.log('> Executing in Development Mode: Webpack Hot Realoding');
  // 1. Agregando la ruta del HMR
  // Reload = true: Habilita la recarga del frontend cuando hay cambios en el codigo
  // Fuente del frontend
  // Timeout = 1000: Tiempo de espera entre recarga de la página
  WebpackDevConfig.entry = ['webpack-hot-middleware/client?reload=true&timeout:1000',
    WebpackDevConfig.entry]

  // 2. Agregando el plugin
  WebpackDevConfig.plugins.push(new Webpack.HotModuleReplacementPlugin());

  // 3. Creando el compilador de webpack
  const compiler = Webpack(WebpackDevConfig);

  // 4. Agregando el middleware a la cadena de middlewares de nuestra aplicación
  app.use(WebpackDevMidddleware(compiler, {
    publicPath: WebpackDevConfig.output.publicPath
  }));

  // 5. Agregando el Webpack Hot Middleware
  app.use(WebpackHotMidddleware(compiler));
} else {
  console.log('> Executing in Production Mode...');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/about', aboutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
