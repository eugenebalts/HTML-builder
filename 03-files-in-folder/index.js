const path = require('path');
const fs = require('fs');

function checkFiles(way) {
    fs.readdir(way, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            let fileName = path.basename(file).split('.')[0],
                fileExt = path.extname(file).split('.')[1];
            fs.stat(path.join(way, file), (err, stats) => {
                if (err) throw err;
                if (fileExt) console.log(`${fileName} - ${fileExt} - ${stats.size * Math.pow(10, -3)}kb`) // If fileExt has no prop, this is not file 
            })
        })
    })
    
}

checkFiles(path.join(__dirname, 'secret-folder'))