const { Entries, Players, Sequelize } = require('../models');
const Op = Sequelize.Op;


//  @desc Gets all song entries in the database
//  @route GET /api/entries
//
const getAllEntries = async (req, res) => {
    const listOfEntries = await Entries.findAll({
        attributes: [
            'id',
            'song',
            'artist',
            'album',
            'year',
            'excerpt',
            'link',
            [Sequelize.col('Player.name'), 'playerName'],
            [Sequelize.col('Player.playerCode'), 'playerCode'],
        ],
        include: [
            { model: Players, attributes: [] }
        ]
    });
    
    return res.json(listOfEntries);
}

//  @desc Creates a new song entry
//  @route POST /api/entries
//
const createEntry = async (req, res) => {
    const entry = req.body;
    await Entries.create(entry);
    return res.status(201).json(entry);
}

//  @desc Updates a song entry
//  @route PUT /api/entries/:id
//
const updateEntry = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ message: "Entry ID is required." });
    }

    const entry = await Entries.findOne({ where: { id: req.params.id } });

    if (!entry) {
        return res.status(204).json({ message: `No entry matches ID ${req.params.id}.` });
    }

    if (req.body?.song) entry.song = req.body.song;
    if (req.body?.artist) entry.artist = req.body.artist;
    if (req.body?.album) entry.album = req.body.album;
    if (req.body?.year) entry.year = req.body.year;
    if (req.body?.excerpt) entry.excerpt = req.body.excerpt;
    if (req.body?.link) entry.link = req.body.link;

    if (req.body?.playerId) {
        const player = await Players.findOne({ where: { id: req.body.playerId } });
        if (!player) {
            return res.json(400).json({ message: `No player matches ID ${req.body.playerId}`});
        }
        
        entry.PlayerId = req.body.playerId;
    }

    const result = await entry.save();
    return res.json(result);
}

//  @desc Deletes a song entry
//  @route DELETE /api/entries/:id
//
const deleteEntry = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ message: "Entry ID is required." });
    }

    const entry = await Entries.findOne({ where: { id: req.params.id } });

    if (!entry) {
        return res.status(204).json({ message: `No entry matches ID ${req.params.id}.` });
    }

    const result = await entry.destroy();
    return res.json(result);
}

//  @desc Gets all song entries submitted by the user
//  @route GET /api/entries/byUser/:id
//
const getUserEntries = async (req, res) => {
    if (!req?.params?.id) { 
        return res.status(400).json({ message: "User ID is required." });
    }

    const listOfEntries = await Entries.findAll({
        where: { UserId: req.params.id }, 
        attributes: [
            'id',
            'song',
            'artist',
            'album',
            'year',
            'excerpt',
            'link',
            [Sequelize.col('Player.name'), 'playerName'],
            [Sequelize.col('Player.playerCode'), 'playerCode'],
        ],
        include: [
            { model: Players, attributes: [] }
        ]
    });

    if (listOfEntries.length === 0) {
        return res.status(204).json({ message: "No entries found." });
    }

    return res.json(listOfEntries);
}


//  @desc Gets all song entries that references a specific player
//  @route GET /api/entries/byPlayer/:id
//
const getPlayerEntries = async (req, res) => {
    if (!req?.params?.id) { 
        return res.status(400).json({ message: "Player ID is required." });
    }

    const listOfEntries = await Entries.findAll({
        where: { PlayerId: req.params.id }, 
        attributes: [
            'id',
            'song',
            'artist',
            'album',
            'year',
            'excerpt',
            'link',
            [Sequelize.col('Player.name'), 'playerName'],
            [Sequelize.col('Player.playerCode'), 'playerCode'],
        ],
        include: [
            { model: Players, attributes: [] }
        ]
    });

    if (listOfEntries.length === 0) {
        return res.status(204).json({ message: "No entries found." });
    }

    return res.json(listOfEntries);
}

//  @desc Gets all searchable items for use in search bar 
//  @route GET /api/entries/searchItems
//
const getSearchItems = async (req, res) => {
    const listOfItems = await Entries.findAll({
        attributes: ['song', 'artist'],
        include: [
            {
                model: Players,
                attributes: ['name']
            }
        ]
    });

    const resList = new Set()
    listOfItems.map((value, key) => {
        resList.add(value.song);
        resList.add(value.Player.name);
        const artists = value.artist.split(", ");
        artists.forEach(a => resList.add(a));
    });

    return res.json([...resList]);
}

//  @desc Gets all song entries based on search query 
//  @route GET /api/entries/search
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
                    Sequelize.fn('lower', Sequelize.col('Player.name')),
                    {
                        [Op.like]: '%' + query + '%'
                    }
                )
            ]
        },
        attributes: [
            'id',
            'song',
            'artist',
            'album',
            'year',
            'excerpt',
            'link',
            [Sequelize.col('Player.name'), 'playerName'],
            [Sequelize.col('Player.playerCode'), 'playerCode'],
        ],
        include: [
            { model: Players, attributes: [] }
        ]
    });

    return res.json(listOfEntries);
}

//  @desc Gets number of unique players in database
//  @route GET /api/entries/playerCount
//
const getPlayerCount = async (req, res) => {
    const numPlayers = await Entries.findAll({
        attributes: [
            [Sequelize.literal('COUNT(DISTINCT(PlayerId))'), 'playerCounter']
        ]
    });
    return res.json(numPlayers);
}


module.exports = {
    getAllEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    getUserEntries,
    getPlayerEntries,
    getSearchItems,
    getSearchResults,
    getPlayerCount,
}