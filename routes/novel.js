const express = require('express')
const router = express.Router()
const NovelController = require('../controllers/NovelController')

/* get all novel */
router.get('/', async (request, response) => {
    response.send(await NovelController.index("all"))
})
/* get 1 novel */
router.get('/:id', async (request, response) => {
    const novel = await NovelController.show(request)
    if(novel.hasOwnProperty('status')) {
        response.status(400).send(novel)
    }
    else {
        response.status(200).send(novel)
    }
})
/* create novel */ 
router.post('/', async (request, response) => {
    const genreList = request.body.genres
    const novel = await NovelController.create(request)
    await NovelController.linkTag(novel.lastId, genreList)
    response.send(createResponse)
})
/* update novel */
router.put('/:id', async (request, response) => {
    // response.send(await NovelController.update(request))
})
/* delete novel */
router.delete('/:id', async (request, response) => {
    // response.send(await NovelController.destroy(request))
})

module.exports = router;