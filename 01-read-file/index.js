const path = require('path');
const fs = require('fs');

const readFile = (path) => {
    const stream = fs.createReadStream(path, 'utf8');
    stream.on('data', (data) => {
        console.log(data);
    })
    stream.on('error', (err) => {
        if (err) console.log(err.message);
    })
};

readFile(path.resolve(__dirname, 'text.txt'));