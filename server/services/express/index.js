import express from 'express'
import path from 'path'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { errorHandler as queryErrorHandler } from 'querymen'
import { errorHandler as bodyErrorHandler } from 'bodymen'
import { env } from '../../config'

export default (routes) => {
  const app = express()

  /* istanbul ignore next */
  if (env === 'production' || env === 'development') {
    app.use(cors())
    app.use(compression())
    app.use(morgan('dev'))
  }

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(express.static(path.join(__dirname, '../../../dist')))
  app.use(routes)
  app.get('*', function (req, res) {
    res.sendfile(path.join(__dirname, '../../../dist/index.html'))
  })

  if (env === 'development') {
    const webpackDev = require('webpack-dev-middleware')
    const webpack = require('webpack')
    const webpackConfig = require('../../../config/webpack.dev')

    app.use(webpackDev(webpack(webpackConfig), {
      publicPath: '/assets/',
      index: 'index.html'
    }))
  }

  app.use(queryErrorHandler())
  app.use(bodyErrorHandler())

  return app
}
