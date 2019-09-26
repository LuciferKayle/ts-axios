const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')
const multipart = require('connect-multiparty');
const path = require('path');

const app = express()
const compiler = webpack(WebpackConfig)

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))


app.use(multipart({
  uploadDir: path.resolve(__dirname, 'upload-file')
}))


const router = express.Router()


const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}


router.get('/simple/get', function (req, res) {
  res.json({
    msg: `hello world`
  })
})

router.get('/base/get', function (req, res) {
  res.json(req.query)
})

router.post('/base/post', function (req, res) {
  res.json(req.body)
})

router.post('/base/buffer', function (req, res) {
  let msg = []
  req.on('data', (chunk) => {
    if (chunk) {
      msg.push(chunk)
    }
  })
  req.on('end', () => {
    let buf = Buffer.concat(msg)
    res.json(buf.toJSON())
  })
})

router.get('/error/get', function (req, res) {
  if (Math.random() > 0.5) {
    res.json({
      msg: 'hello world'
    })
  } else {
    res.status(500)
    res.end()
  }
})

router.get('/error/timeout', function (req, res) {
  setTimeout(() => {
    res.json({
      msg: 'hello world'
    })
  }, 3000)
})

router.get('/extend/get', function (req, res) {
  res.json({
    msg: `hello world`
  })
})

router.options('/extend/options', function (req, res) {
  res.json({
    msg: `hello world`
  })
})
router.delete('/extend/delete', function (req, res) {
  res.json({
    msg: `hello world`
  })
})

router.head('/extend/head', function (req, res) {
  res.json({
    msg: `hello world`
  })
})

router.post('/extend/post', function (req, res) {
  res.json({
    msg: `hello world`
  })
})

router.put('/extend/put', function (req, res) {
  res.json({
    msg: `hello world`
  })
})

router.patch('/extend/patch', function (req, res) {
  res.json({
    msg: `hello world`
  })
})

router.get('/interceptor/get', function (req, res) {
  res.end('hello')
})


// 默认配置
router.post('/config/post', function (req, res) {
  res.json({
    msg: `hello world`
  })
})


// 取消功能
router.post('/cancel/post', function (req, res) {
  res.json({
    msg: `hello world`
  })
})

router.get('/cancel/get', function (req, res) {
  res.json({
    msg: `hello world`
  })
})

router.get('/more/get', function (req, res) {
  res.set(cors);
  res.json({
    msg: `hello world`
  })
})

router.post('/more/upload', function(req, res) {
  console.log(req.body, req.files)
  res.end('upload success!')
})


app.use(router)


app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname, {
  setHeaders(res) {
    res.cookie('XSRF-TOKEN-D', '1234abc')
  }
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const port = process.env.PORT || 8080
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})




