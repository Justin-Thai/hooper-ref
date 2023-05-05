const { Entries, Sequelize } = require('../models');
const Op = Sequelize.Op;


//  @desc Gets all song entries in the database
//  @route GET /entries
//
const getAllEntries = async (req, res) => {
    const listOfEntries = await Entries.findAll();
    res.json(listOfEntries);
}

//  @desc Creates a new song entry
//  @route POST /entries
//
const createEntry = async (req, res) => {
    const entry = req.body;
    await Entries.create(entry);
    res.json(entry);
}

//  @desc Gets all searchable items for use in search bar 
//  @route GET /entries/searchItems
//
const getSearchItems = async (req, res) => {
    const listOfItems = await Entries.findAll({
        attributes: ['song', 'artist', 'player']
    });

    const resList = new Set()
    listOfItems.map((value, key) => {
        resList.add(value.song);
        resList.add(value.player);
        const artists = value.artist.split(", ");
        artists.forEach(a => resList.add(a));
    });

    res.json([...resList]);
}

//  @desc Gets all song entries based on search query 
//  @route GET /entries/search
//
const getSearchResults = async (req, res) => {
    const query = req.query.q.toLowerCase();

    const listOfEntries = await Entries.findAll({
        where: {
            [Op.or]: [
                Sequelize.where(
                    Sequelize.fn('lower', Sequelize.col('song')),
                    {
                        [Op.like]: '%' + query + '%'
                    }
                ),
                Sequelize.where(
                    Sequelize.fn('lower', Sequelize.col('artist')),
                    {
                        [Op.like]: '%' + query + '%'
                    }
                ),
                Sequelize.where(
                    Sequelize.fn('lower', Sequelize.col('player')),
                    {
                        [Op.like]: '%' + query + '%'
                    }
                )
            ]
        }
    });

    res.json(listOfEntries);
}

//  @desc Gets number of unique players in database
//  @route GET /entries/playerCount
//
const getPlayerCount = async (req, res) => {
    const numPlayers = await Entries.findAll({
        attributes: [
            [Sequelize.literal('COUNT(DISTINCT(player))'), 'playerCounter']
        ]
    });
    res.json(numPlayers);
}


module.exports = {
    getAllEntries,
    createEntry,
    getSearchItems,
    getSearchResults,
    getPlayerCount,
}