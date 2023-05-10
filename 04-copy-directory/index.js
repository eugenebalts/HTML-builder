const path = require('path');
const fsPromises = require('fs/promises');
const {copyFile, readdir, mkdir, rm} = require('node:fs/promises');

async function copyFiles(folder) {

    const copiedFiles = await readdir(path.join(__dirname, folder), (err, files) => {
        if (err) throw err;
    });

    async function rmDir(folder) {
        try { // delete and create if there is folder
            const folderContent = await fsPromises.readdir(folder, {withFileTypes: true}, err => {
                if (err) return;
            });
            for (const file of folderContent) {
                file.isFile() ? await fsPromises.rm(path.join(folder, file.name)) : await recreateFolder(path.join(folder, file.name))
            }
        } catch (err) {
            return;
        }
    }

    await rmDir(path.join(__dirname, `${folder}-copy`));
    
    await mkdir(path.join(__dirname, `${folder}-copy`), {recursive: true});
    for (const file of copiedFiles) {
        await copyFile(path.join(path.join(__dirname, folder), file), path.join(path.join(__dirname, `${folder}-copy`), file));
    }
    }

copyFiles('files')




