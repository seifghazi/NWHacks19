module.exports = (app) => {
    const drawings = require('../controllers/drawing.js');

    app.post('/drawings', drawings.create);

    app.get('/drawings', drawings.findAll);

    app.get('/drawings/nearby', drawings.findNearby)

    app.get('/drawings/:drawingId', drawings.findOne);

    app.put('/drawings/:drawingId', drawings.update);

    app.delete('/drawings/:drawingId', drawings.delete);
}