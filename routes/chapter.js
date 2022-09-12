const express = require('express')
const router = express.Router()
const ChapterController = require('../controllers/ChapterController')

/* get all chapter */
router.get('/', async (request, response) => {
    response.send(await ChapterController.index())
})
/* get 1 chapter */
router.get('/:id', async (request, response) => {
    // response.send(await Chapter.show(request))
})
/* create chapter */
router.post('/', async (request, response) => {
    response.status(201).send(await ChapterController.create(request))
})
/* update chapter */
router.put('/:id', async (request, response) => {
    // response.send(await Chapter.update(request))
})
/* delete chapter */
router.delete('/:id', async (request, response) => {
    // response.send(await Chapter.destroy(request))
})

module.exports = router;