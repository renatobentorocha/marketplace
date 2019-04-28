const express = require('express')
const validade = require('express-validation')
const handle = require('express-async-handler')

const routes = express.Router()

const controllers = require('./app/controllers')
const validators = require('./app/validators')

const authMiddlewares = require('./app/middlewares/auth')

routes.post(
  '/users',
  validade(validators.User),
  handle(controllers.UserController.store)
)

routes.post(
  '/sessions',
  validade(validators.Session),
  handle(controllers.SessionController.store)
)

routes.use(authMiddlewares)

routes.get('/ads', controllers.AdController.index)
routes.get('/ads/:id', controllers.AdController.show)
routes.post(
  '/ads',
  validade(validators.Ad),
  handle(controllers.AdController.store)
)
routes.put(
  '/ads/:id',
  validade(validators.Ad),
  handle(controllers.AdController.update)
)
routes.delete('/ads/:id', controllers.AdController.destroy)

routes.post(
  '/purchases',
  validade(validators.Purchase),
  handle(controllers.PurchaseController.store)
)

module.exports = routes
