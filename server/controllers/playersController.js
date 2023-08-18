const { Players } = require('../models');
const { spawnSync }  = require('child_process');
const redisClient = require('../utils/redis');

const DEFAULT_EXPIRATION = 300;    // Seconds
const webScraperLocation = '../web_scraper/bf_web_scraper.py';

// @desc Gets all players
// @route GET /players
//
const getAllPlayers = async (req, res) => {
    const listOfPlayers = await Players.findAll();
    return res.json(listOfPlayers);
}

// @desc Creates a new player
// @route POST /players
//
const createPlayer = async (req, res) => {
    const { name, playerCode } = req.body;

    const nameCheck = await Players.findAll({ where: { name: name } });
    const codeCheck = await Players.findOne({ where: { playerCode: playerCode } });

    if (nameCheck.length > 0 && codeCheck) {
        return res.status(200).json(codeCheck);
    }
    else if (codeCheck) {
        return res.status(409).json({ message: "Player name not found, but player's code already registered." });
    }

    const player = await Players.create({
        name: name,
        playerCode: playerCode,
    })

    return res.status(201).json(player);
}

// @desc Gets a player based on given player code
// @route PUT /players/:playerCode
//
const getPlayer = async (req, res) => {
    if (!req?.params?.playerCode) {
        return res.status(400).json({ message: "Player code is required." });
    }

    const player = await Players.findOne({ where: { playerCode: req.params.playerCode } });

    if (!player) {
        return res.status(204).json({ message: "No player found." });
    }

    let result = {
        'playerKey': {
            'id': player.id,
            'name': player.name,
            'playerCode': player.playerCode
        }
    }
    
    const [bio, stats] = await Promise.all([
        redisClient.get(`bio:${player.playerCode}`),
        redisClient.get(`stats:${player.playerCode}`)
    ]);

    if (bio != null && stats != null) {
        result.bio = JSON.parse(bio);
        result.stats = JSON.parse(stats);   
    }
    else {
        try {
            const webScraperProcess = spawnSync('../web_scraper/project_env/Scripts/python', [webScraperLocation, player.playerCode]);
            if (webScraperProcess.status !== 0) {
                console.error(`Child process error:\n ${webScraperProcess.stderr.toString()}`);
                console.error(`Child process exited with code ${webScraperProcess.status}.`);
            }
            const playerData = JSON.parse(webScraperProcess.stdout.toString());
            result.bio = playerData.bio;
            result.stats = playerData.stats;

            await Promise.all([
                redisClient.setEx(`bio:${player.playerCode}`, DEFAULT_EXPIRATION, JSON.stringify(playerData.bio)),
                redisClient.setEx(`stats:${player.playerCode}`, DEFAULT_EXPIRATION, JSON.stringify(playerData.stats))
            ]);
        }
        catch (err) {
            console.error(err);
        }   
    }

    return res.json(result);
}

// @desc Updates a current player
// @route PUT /players/:id
//
const updatePlayer = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ message: "Player ID is required." });
    }

    const player = await Players.findOne({ where: { id: req.params.id } });
    if (!player) {
        return res.status(204).json({ message: `No player matches ID ${req.params.id}.`});
    }

    if (req.body?.name) {
        player.name = req.body.name;
    }

    if (req.body?.playerCode) {
        player.playerCode = req.body.playerCode;
    }

    const result = await player.save();
    return res.json(result);
}

// @desc Deletes a player
// @route DELETE /players/:id
//
const deletePlayer = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ message: "Player ID is required." });
    }

    const player = await Players.findOne({ where: { id: req.params.id} });
    if (!player) {
        return res.status(204).json({ message: `No player matches ID ${req.params.id}.`});
    }

    const result = await player.destroy();
    return res.json(result);
}


module.exports = {
    getAllPlayers,
    createPlayer,
    getPlayer,
    updatePlayer,
    deletePlayer
}