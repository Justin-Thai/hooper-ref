const express = require('express');
const router = express.Router();
const { Entries, Sequelize } = require('../models');
const Op = Sequelize.Op;


router.get('/', async (req, res) => {
    const listOfEntries = await Entries.findAll();
    res.json(listOfEntries);
});

router.get('/searchItems', async (req, res) => {
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
});

router.get('/search', async (req, res) => {
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
});

router.get('/playerCount', async (req, res) => {
    const numPlayers = await Entries.findAll({
        attributes: [
            [Sequelize.literal('COUNT(DISTINCT(player))'), 'playerCounter']
        ]
    });
    res.json(numPlayers);
});

router.post('/', async (req, res) => {
    const entry = req.body;
    await Entries.create(entry);
    res.json(entry);
});


module.exports = router;