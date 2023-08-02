const { Players, Sequelize } = require('../models');


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
    updatePlayer,
    deletePlayer
}