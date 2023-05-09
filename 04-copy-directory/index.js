const path = require('path');
const fs = require('fs');
const {copyFile, readdir, mkdir, rm} = require('node:fs/promises');

async function copyFiles(folder) {

    const copiedFolder = `${path.join(__dirname, folder)}`;
    const pastedFolder = path.join(__dirname, `${folder}-copy`);
    const copiedFiles = await readdir(copiedFolder, (err, files) => {
        if (err) throw err;
    });

    async function rmDir(folder) {
        try { // delete and create if there is folder
            const folderContent = await fsPromises.readdir(folder, {withFileTypes: true}, err => {
                if (err) return;
            });
            for (const file of folderContent) {
                const dirToFile = path.join(folder, file.name)
                file.isFile() ? await fsPromises.rm(dirToFile) : await recreateFolder(dirToFile)
            }
        } catch (err) {
            return;
        }
    }

    await rmDir(pastedFolder);
    
    await mkdir(path.join(__dirname, `${folder}-copy`), {recursive: true});
    for (const file of copiedFiles) {
        await copyFile(path.join(copiedFolder, file), path.join(pastedFolder, file));
    }
    }

copyFiles('files')




