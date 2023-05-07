const path = require('path');
const fs = require('fs');
const {copyFile, readdir, mkdir, rm} = require('node:fs/promises');

async function copyFiles(folder) {

    const copiedFolder = `${path.join(__dirname, folder)}`;
    const pastedFolder = path.join(__dirname, `${folder}-copy`);
    const copiedFiles = await readdir(copiedFolder, (err, files) => {
        if (err) throw err;
    });
    // console.log(path.dirname(copiedFolder))
    await mkdir(path.join(__dirname, `${folder}-copy`), {recursive: true});
    await fs.readdir(pastedFolder, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            rm(path.join(pastedFolder, file))
        }
    })

    for (const file of copiedFiles) {
        // console.log(file)
        await copyFile(path.join(copiedFolder, file), path.join(pastedFolder, file));
        // console.log(await fsPromises.readFile(path.join(copiedFolder, file), 'utf-8'))
    }
}

copyFiles('files')




