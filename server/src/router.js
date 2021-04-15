const express = require('express')
const router = express.Router()

//middleware
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

router.get('/', (req, res) => {
  res.status(200).send('Server is live')
})

module.exports = router
