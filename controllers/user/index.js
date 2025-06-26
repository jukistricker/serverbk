var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var models = reqlib('database').models
var moment = require('moment')
const { ObjectId } = require('mongoose').Types

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const currentDirectory = __dirname;
const parentDirectory = path.resolve(currentDirectory, '..', '..');
const savePathImageAvatar = `${parentDirectory}/images/avatar`;

const cloudinary = require('../../utils/cloudinary');

module.exports = () => {
    router.post('/update', async (req, res) => {
        try {
            const UserID = req.UserID;
            const { FullName } = req.body;

            const user = await models.Users.findOne({ _id: new ObjectId(UserID) }).exec();
            if (!user) {
                return res.status(400).json({ status: 0, data: null, message: 'User not found' });
            }

            const updateObject = {};
            if (FullName) updateObject.FullName = FullName;

            // Upload file avatar (nếu có)
            if (req.files && req.files.length > 0) {
                const avatarFile = req.files.find(file => file.fieldname === 'avatar');
                if (avatarFile) {
                    const base64 = avatarFile.buffer.toString('base64');
                    const dataUri = `data:${avatarFile.mimetype};base64,${base64}`;

                    const uploadRes = await cloudinary.uploader.upload(dataUri, {
                        folder: 'avatars',
                        public_id: uuidv4(),
                    });

                    updateObject.Avatar = uploadRes.secure_url; // lấy URL public của ảnh
                }
            }

            updateObject.UpdateAt = moment().toDate();

            if (Object.keys(updateObject).length > 0) {
                await models.Users.updateOne({ _id: user._id }, { $set: updateObject });
            }

            return res.status(200).json({ status: 1, data: null, message: "update success" });

        } catch (error) {
            console.error(error);
            return res.status(400).json({ status: 0, data: null, message: error.message });
        }
    });

    router.get('/info', async (req, res) => {
        try {
            const UserID = req.UserID
            let user = await models.Users.findOne({ _id: new ObjectId(UserID) }).exec()
            if (user == null) {
                return res.status(400).json({ status: 0, data: null, message: 'User not found' })
            }
            return res.status(200).json({
                status: 1, data: {
                    Username: user?.Username,
                    FullName: user?.FullName,
                    Avatar: user?.Avatar
                }, message: ''
            })
        } catch (error) {
            return res.status(400).json({ status: 0, data: null, message: error.message })
        }
    })
    return router
}