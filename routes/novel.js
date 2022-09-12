const express = require('express')
const router = express.Router()
const multer = require('multer');
const NovelController = require('../controllers/NovelController')

/* get all novel */
router.get('/', async (request, response) => {
    const novel = await NovelController.index("all")
    if(novel.hasOwnProperty('status')) {
        response.status(400).send(novel)
    }
    else {
        response.status(200).send(novel)
    }
})
/* get 1 novel */
router.get('/:id', async (request, response) => {
    const novel = await NovelController.show(request)
    if(novel.hasOwnProperty('status')) {
        response.status(404).send(novel)
    }
    else {
        response.status(200).send(novel)
    }
})
/* create novel */ 
router.post('/', async (request, response) => {
    /* upload image */
    const imageStorage = multer.diskStorage({
        destination: function (request, file, cb) {
            cb(null, 'public/upload/images')
        },
        filename: function (request, file, cb) {
            cb(null, file.originalname )
        }
    })
    const uploadImage = multer({ storage: imageStorage }).single('fileImage')
    uploadImage(request, response, async(error) => {
        if (error instanceof multer.MulterError) {
            return response.status(500).json(error)
        } else if (error) {
            return response.status(500).json(error)
        }
        /* prepare data to create new novel */
        const data = {"books": request.body, "genres": request.body.genres}
        delete data.books.genres
        data.books.cover_image = request.file.filename
        const genreList = data.genres
        const novel = await NovelController.create(data)
        await NovelController.linkTag(novel.lastId, genreList)
        if(novel.hasOwnProperty('status')) {
            response.status(400).send(novel)
        }
        else {
            response.status(201).send(novel)
        }
    })
    
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