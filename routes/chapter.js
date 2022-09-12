const express = require('express')
const router = express.Router()
const ChapterController = require('../controllers/ChapterController')

router.get('/', async (request, response) => {
    response.send(await ChapterController.index())
})
router.get('/:id', async (request, response) => {
    // response.send(await Chapter.show(request))
})
router.post('/', async (request, response) => {
    response.status(201).send(await ChapterController.create(request))
})
router.put('/:id', async (request, response) => {
    // response.send(await Chapter.update(request))
})
router.delete('/:id', async (request, response) => {
    // response.send(await Chapter.destroy(request))
})

module.exports = router;