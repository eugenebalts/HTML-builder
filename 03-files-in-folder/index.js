const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises')

async function checkFiles(way) {
    const files = await fsPromises.readdir(way, { withFileTypes: true });
    files.filter(el => el.isFile()).forEach(file => {
        fs.stat(path.join(way, file.name), (err, stats) => {
            if (err) throw err;
            let fileName = file.name.split('.')[0],
                fileExt = path.extname(file.name).split('.')[1],
                fileSize = `${stats.size * Math.pow(10, -3)}kb`
            console.log(`${fileName} - ${fileExt} - ${fileSize}`)
        })
    })
}
checkFiles(path.join(__dirname, 'secret-folder'))

