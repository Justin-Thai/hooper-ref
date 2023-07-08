const { Submissions, Users } = require('../models');

// @desc Gets all submissions in the database
// @route GET /submissions
//
const getAllSubs = async (req, res) => {
    const listOfSubs = await Submissions.findAll({
        attributes: [
            'id',
            'song',
            'artist',
            'player',
            'link',
            'createdAt'
        ],
        include: [
            {
                model: Users,
                attributes: ['id', 'username']
            }
        ]
    });
    return res.json(listOfSubs);
}

// @desc Creates a new submission
// @route POST /submissions
//
const createSub = async (req, res) => {
    const submission = req.body;
    submission.UserId = req.id;
    await Submissions.create(submission);
    return res.status(201).json(submission);
}

// @desc Deletes a submission
// @route DELETE /submissions
//
const deleteSub = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ message: "Submission ID is required." });
    }

    const submission = await Submissions.findOne({ where: { id: req.body.id } });

    if (!submission) {
        return res.status(204).json({ message: `No submission matches ID ${req.body.id}.` })
    }

    const result = await submission.destroy();
    return res.json(result);
}


module.exports = {
    getAllSubs,
    createSub,
    deleteSub
}