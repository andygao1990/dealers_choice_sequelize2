const express = require ('express')
const { conn, syncAndSeed, models: { Family, Person } } = require('./db')
const app = express()

app.get('/api/families', async (req, res, next) => {
    try {
        res.send(await Family.findAll({
            include: [
                {model: Person, as: "HoH"}
            ]
        }))
    }
    catch (err) {
        next(err)
    }
})

app.get('/api/people', async (req, res, next) => {
    try {
        res.send(await Person.findAll({
            include: [
                {model: Person, as: 'parent'},
                {model: Person, as: 'children'},
            ]}))
        }
    catch (err) {
        next(err)
    }
})

const init = async () => {
    try {
        await conn.authenticate()
        await syncAndSeed()
        const port = process.env.PORT || 3000
        app.listen(port, () => console.log(`listening on port ${port}`))
    }
    catch (err) {
        console.log(err)
    }
}

init()