const { Entries, Sequelize } = require('../models');
const Op = Sequelize.Op;


//  @desc Gets all song entries in the database
//  @route GET /entries
//
const getAllEntries = async (req, res) => {
    const listOfEntries = await Entries.findAll();
    return res.json(listOfEntries);
}

//  @desc Creates a new song entry
//  @route POST /entries
//
const createEntry = async (req, res) => {
    const entry = req.body;
    await Entries.create(entry);
    return res.status(201).json(entry);
}

//  @desc Updates a song entry
//  @route PUT /entries
//
const updateEntry = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ message: "Entry ID is required." });
    }

    const entry = await Entries.findOne({ where: { id: req.body.id } });

    if (!entry) {
        return res.status(204).json({ message: `No entry matches ID ${req.body.id}.` });
    }

    if (req.body?.song) entry.song = req.body.song;
    if (req.body?.artist) entry.artist = req.body.artist;
    if (req.body?.album) entry.album = req.body.album;
    if (req.body?.year) entry.year = req.body.year;
    if (req.body?.player) entry.player = req.body.player;
    if (req.body?.excerpt) entry.excerpt = req.body.excerpt;
    if (req.body?.link) entry.link = req.body.link;

    const result = await entry.save();
    return res.json(result);
}

//  @desc Deletes a song entry
//  @route DELETE /entries
//
const deleteEntry = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ message: "Entry ID is required." });
    }

    const entry = await Entries.findOne({ where: { id: req.body.id } });

    if (!entry) {
        return res.status(204).json({ message: `No entry matches ID ${req.body.id}.` });
    }

    const result = await entry.destroy();
    return res.json(result);
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

    return res.json([...resList]);
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

    return res.json(listOfEntries);
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
    return res.json(numPlayers);
}


module.exports = {
    getAllEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    getSearchItems,
    getSearchResults,
    getPlayerCount,
}