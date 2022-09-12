const db = require('../database')

class ChapterController{

    static async index() {
        let chapterList = []
        try {
            chapterList = await db
                .select('books.id', 'books.title', db.raw('MAX(chapters.created_at) as lastUpdate'))
                .count('books.title as chapters')
                .from('chapters')
                .leftJoin('books', 'chapters.book_id', 'books.id')
                .groupBy('books.title')
            
                return chapterList
        }
        catch (error) {
            return error
        }
    }

    static async create(request) {
        let newData = []
        const dataToCreate = request.body
        try {
            newData = await db
                .insert(dataToCreate)
                .into('chapters')
            
            return {messages: "add new data success.", lastId: newData[0]}
        }
        catch (error) {
            return error
        }
    }

    static async getChapters(id) {
        let chapter = []
        try {
            chapter = await db
                .select('books.id as bookId', 'books.title', db.raw('MAX(chapters.created_at) as lastUpdate'))
                .count('books.title as chapters')
                .from('chapters')
                .leftJoin('books', 'chapters.book_id', 'books.id')
                .where('chapters.book_id', id)
                .groupBy('books.title')
        }
        catch (error) {
            return error
        }
        if(chapter.length > 0) {
            return chapter[0]
        }
        else {
            return 0
        }
    }

    static async getChapterContent(id) {
        let chapterList = []
        try {
            chapterList = await db
                .select('*')
                .from('chapters')
                .where('chapters.book_id', id)
                .orderBy('chapters.number', 'asc')
        }
        catch (error) {
            return error
        }
        if(chapterList.length > 0) {
            return chapterList
        }
        else {
            return null
        }
    }
}

module.exports = ChapterController;