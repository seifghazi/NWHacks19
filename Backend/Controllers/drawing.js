const Drawing = require('../models/drawing.js');

exports.create = (req, res) => {
    if (!req.body.longitude || !req.body.latitude || !req.body.points) {
        return res.status(400).send({
            message: "Drawing content can not be empty"
        });
    }

    var drawing = new Drawing({
        user_id: req.body.user_id || "Test",
        meta: {
            upvotes: 0,
            downvotes: 0
        }
    });
    drawing["longitude"] = req.longitude;
    drawing["latitude"] = req.latitude;
    drawing["points"] = req.points;

    drawing.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Drawing"
            });
        });
};

exports.findAll = (req, res) => {
    Drawing.find()
        .then(drawings => {
            res.send(drawings);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Drawings."
            });
        });
};

exports.findNearby = (req, res) => {
    var latitudeThreshold = 15 / 111111;
    var longitudeThreshold = 15 / 111111 * Math.cos(req.params.latitude);

    Drawing.find({
        latitude: { $lte: req.params.latitude - latitudeThreshold, $gte: req.params.latitude } + latitudeThreshold,
        longitude: { $lte: req.params.longitude - longitudeThreshold, $gte: req.params.longitude + longitudeThreshold }
    })
        .then(drawings => {
            res.send(drawings);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Drawings."
            });
        });
};

exports.findOne = (req, res) => {
    Drawing.findById(req.params.drawingId)
        .then(drawing => {
            if (!drawing) {
                return res.status(404).send({
                    message: "Drawing not found with id " + req.params.drawingId
                });
            }
            res.send(drawing);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Drawing not found with id " + req.params.drawingId
                });
            }
            return res.status(500).send({
                message: "Error retrieving drawing with id " + req.params.drawingId
            });
        });
};

exports.update = (req, res) => {
    Drawing.findByIdAndUpdate(req.params.drawingId, {
        user_id: req.body.user_id || "Test",
        longitude: req.longitude,
        latitude: req.latitude,
        points: req.points,
        meta: {
            upvotes: req.meta.upvotes,
            downvotes: req.meta.downvotes
        }
    }, { new: true })
        .then(drawing => {
            if (!drawing) {
                return res.status(404).send({
                    message: "Drawing not found with id " + req.params.drawingId
                });
            }
            res.send(drawing);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Drawing not found with id " + req.params.drawingId
                });
            }
            return res.status(500).send({
                message: "Error updating drawing with id " + req.params.drawingId
            });
        });
};

exports.delete = (req, res) => {
    Drawing.findByIdAndRemove(req.params.drawingId)
        .then(drawing => {
            if (!drawing) {
                return res.status(404).send({
                    message: "Drawing not found with id " + req.params.drawingId
                });
            }
            res.send({ message: "Drawing deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Drawing not found with id " + req.params.drawingId
                });
            }
            return res.status(500).send({
                message: "Could not delete drawing with id " + req.params.drawingId
            });
        });
};