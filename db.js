const Sequelize = require ('sequelize')
const { STRING, UUID, UUIDV4 } = Sequelize
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/family_db')

const Family = conn.define('family', {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    familyName: {
        type: STRING
    }
})

const Person = conn.define('person', {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    firstName: {
        type: STRING
    }
})

Person.belongsTo(Person, {as: 'parent'})
Person.hasMany(Person, {foreignKey: 'parentId', as: 'children'})

Family.belongsTo(Person, {as: 'HoH'})

const syncAndSeed = async () => {
    await conn.sync({ force:true })
    const [moe, lucy, larry, ethyl, black, white, brown] = await Promise.all ([
        Person.create({firstName: 'moe'}),
        Person.create({firstName: 'lucy'}),
        Person.create({firstName: 'larry'}),
        Person.create({firstName: 'ethyl'}),
        Family.create({familyName: 'black'}),
        Family.create({familyName: 'white'}),
        Family.create({familyName: 'brown'}),
    ])

    lucy.parentId = moe.id
    black.HoHId = moe.id
    white.HoHId = larry.id
    brown.HoHId = ethyl.id
    await Promise.all([
        lucy.save(),
        black.save(),
        white.save(),
        brown.save()
    ])
}



module.exports = {
    conn,
    syncAndSeed,
    models: {
        Family,
        Person
    }
}