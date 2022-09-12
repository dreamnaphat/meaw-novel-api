const db = require('../database')
const ChapterController = require('./ChapterController')

class NovelController{

    static async index(order="newest") {
        let novelList = []
        try {
            novelList = await db
                .select('books.id', 'books.title', 'books.author', 'books.created_at', db.raw('JSON_ARRAYAGG(genres.name) as genreList'))
                .from('books')
                .leftJoin('books_genres', 'books.id', 'books_genres.book_id')
                .leftJoin('genres', 'books_genres.genre_id', 'genres.id')
                .groupBy('books.title')
                .orderBy('books.id', 'desc')
        }
        catch (error) {
            return error
        }
        for (let index = 0; index < novelList.length; index++) {
            const chapterContent = await ChapterController.getChapterContent(novelList[index].id)
            novelList[index].lastUpdate = this.calcLastUpdate(chapterContent) || novelList[index].created_at
            novelList[index].chapters = chapterContent?.length || 0
        }
        /* order desc (last update) */
        novelList.sort((a, b) => {
            return b.lastUpdate - a.lastUpdate
        })
        if (order === "newest") {
            novelList.length = 6
            return novelList
        }
        else {
            return novelList
        }
        
    }

    static async show(request) {
        const { id } = request.params
        let novel = []
        try {
            novel = await db
                .select('books.title', 'books.author', 'books.created_at', db.raw('JSON_ARRAYAGG(genres.name) as genreList'))
                .from('books')
                .leftJoin('books_genres', 'books.id', 'books_genres.book_id')
                .leftJoin('genres', 'books_genres.genre_id', 'genres.id')
                .groupBy('books.title')
                .where('books.id', id)
        }
        catch (error) {
            return error
        }
        if(novel.length > 0) {
            const chapterContent = await ChapterController.getChapterContent(id)
            novel[0].lastUpdate = this.calcLastUpdate(chapterContent) || novel[0].created_at
            novel[0].chapters = chapterContent?.length || 0
            novel[0].chapterList = chapterContent
            return novel[0]
        }
        else {
            return {status: "failed", messages: "this id isn't exist."}
        }
    }

    static async create(request) {
        let newData = []
        const dataToCreate = request.body.books
        try {
            newData = await db
                .insert(dataToCreate)
                .into('books')
            
            return {messages: "add new data success.", lastId: newData[0]}
        }
        catch (error) {
            return error
        }
    }

    static async linkTag(bookId, genreList) {
        genreList.forEach( async(genre) => {
            try {
                await db
                    .insert({
                        book_id: bookId,
                        genre_id: genre
                    })
                    .into('books_genres')
            }
            catch (error) {
                return error
            }
        })
    }

    static calcLastUpdate(chapterList=null) {
        if (chapterList === null) return 
        const lastUpdate = new Date(
            Math.max(
                ...chapterList.map(chapter => {
                    return new Date(chapter.created_at)
                })
            )
        )
        return lastUpdate
    }
}

module.exports = NovelController;