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

    static async show(request) {
        const { id } = request.params
        let chapter = []
        try {
            chapter = await db
                .select('books.title', 'chapters.*')
                .from('chapters')
                .leftJoin('books', 'chapters.book_id', 'books.id')
                .where('chapters.id', id)
            
        }
        catch (error) {
            return error
        }
        if(chapter.length > 0) {
            const contentLine = chapter[0].content.split("\n")
            chapter[0].content = await this.addTab(contentLine)
            return chapter[0]
        }
        else {
            return {status: "failed", messages: "this id isn't exist."}
        }
    }

    static addTab(textArray) {
        const newTextArray = textArray.map(text => {
            return `        ${text}`
        })
        return newTextArray
    }

    static hashId() {
        let results = ''
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for ( let i = 0; i < 12; i++ ) {
            results += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return results;
    }
}

module.exports = ChapterController;