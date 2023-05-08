const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

async function mergeStyles(folderToPaste) {
    const toFolder = path.join(__dirname, folderToPaste);
    const fromFolder = path.join(__dirname, 'styles');
    const bundleCss = path.join(toFolder, 'bundle.css');
    const writableStream = fs.createWriteStream(bundleCss, 'utf-8');
    const filesFromFolder = await fsPromises.readdir(fromFolder, {withFileTypes: true});
    filesFromFolder.filter(el => el.isFile())
    .filter(file => path.extname(file.name) === '.css')
    .forEach(file => {
        const readableStream = fs.createReadStream(path.join(fromFolder, file.name), 'utf-8');
        readableStream.on('data', data => {
            writableStream.write(data);
        })
    })
}

mergeStyles('project-dist');

