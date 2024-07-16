const express = require('express');

const Notify = require('../models/notify');


const router = express.Router();

router.post('/:userId', async (req,res) => {
    const userId = req.params.userId
    const {title, description} = req.body
    try {
        const newNotify = new Notify({
            title: title,
            description: description,
            userId: userId
        });
        const savedNotify = await newNotify.save();
        res.status(200).json(savedNotify)
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: error.message})
    }
});


router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const notifys = await Notify.find({ userId: userId });

        res.status(200).json(notifys);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: error.message})
    }
})

router.get('/notifyDetail/:notifyId', async (req, res) => {
    const notifyId = req.params.notifyId;

    try {
        const notifyItem = await Notify.findById(notifyId);
        if(!notifyItem){
            return res.status(404).json({message: 'notify not found'})
        }
        res.status(200).json(notifyItem);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: error.message})
    }
})

module.exports = router
