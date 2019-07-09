const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');

const server = express();

// mongoose model
const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mimetype: String,
    content: Buffer,
});

const fileModel = mongoose.model("File", fileSchema);

async function run() {
    try {
        await mongoose.connect('mongodb+srv://{username}:{password}@sahebleva-mljuj.mongodb.net/{dbname}?retryWrites=true', {
            useNewUrlParser: true,
        })
    } catch (error) {
        throw error;
    }

    if (!(await fileModel.countDocuments().exec())) {
        const fileName = 'image.jpg';
        const fileContent = fs.readFileSync(`${__dirname}/images/${fileName}`);
        
        await fileModel.create({
            name: fileName,
            mimetype: 'image/jpeg',
            content: fileContent
        });
        console.log('new image added!');
    }

    server.get('/getImageWithLean', async (req, res) => {
        const file = await fileModel.findOne({}).lean();
        if (file == null) {
            res.sendStatus(400).send();
            return;
        }
        res.contentType(file.mimetype);
        res.send(file.content);
    });

    server.get('/getImage', async (req, res) => {
        const file = await fileModel.findOne({});
        if (file == null) {
            res.sendStatus(400).send();
            return;
        }
        res.contentType(file.mimetype);
        res.send(file.content);
    });



    server.listen(3000, (error) => {
        if (error) {
            throw error;
        }
        console.log('Sever run on port: 3000');

    });
}

run();

