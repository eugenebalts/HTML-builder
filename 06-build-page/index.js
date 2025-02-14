const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
// const {copyFile, readdir, mkdir, rm} = require('node:fs/promises');


//CONSTANTS
const compsFolder = path.join(__dirname, 'components');
const projectDist = path.join(__dirname, 'project-dist');

async function recreateFolder(folder) {
    try {
        const folderContent = await fsPromises.readdir(folder, {withFileTypes: true}, err => {
            if (err) return err;
        });
        for (const file of folderContent) {
            const dirToFile = path.join(folder, file.name)
            if (file.isDirectory()) {
                await recreateFolder(path.join(folder, file.name));
            }
            if (file.isFile()) await fsPromises.unlink(path.join(folder, file.name))
        }
    
        await fsPromises.rmdir(folder)

    } catch (err) {
        return;
    }
}

async function buildWeb() {
    await recreateFolder(path.join(__dirname, 'project-dist'));
    // CREATE PROJECT-DIST
    await fsPromises.mkdir(path.join(__dirname, 'project-dist'), err => {
        if (err) throw err;
    });

    // 2 HTML 
        // CREATE FILE HTML
        const indexHtml = fs.createWriteStream(path.join(path.join(__dirname, 'project-dist'), 'index.html'), 'utf-8');
        // READ COMPONENTS
        const compsFiles = await fsPromises.readdir(path.join(__dirname, 'components'), {withFileTypes: true});
        const semantics = {};
        compsFiles.filter(file => file.isFile())
        for (const file of compsFiles) {
            semanticsName = file.name.split('.')[0];
            semantics[semanticsName] = await fsPromises.readFile(path.join(path.join(__dirname, 'components'), file.name), 'utf-8');
        }
        const template = await fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf-8');
        let templateContent = template;
        for (const prop in semantics) {
            templateContent = templateContent.replace(`{{${prop}}}`, semantics[prop])
        }
        indexHtml.write(templateContent);

    // 3 Merge styles - Done
    const writableSteam = fs.createWriteStream(path.join(path.join(__dirname, 'project-dist'), 'style.css'), 'utf-8');
    const styles = await fsPromises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true})
    styles.filter(file => file.isFile())
    .filter(file => path.extname(file.name) === '.css')
    .forEach(file => {
        const readableStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
        readableStream.on('data', data => {
            writableSteam.write(data)
        })
    });

    await copyAssets('assets');
}

async function copyAssets(folder) {
    await fsPromises.mkdir(path.join(path.join(__dirname, 'project-dist'), folder), {recursive: true})
    const assetsFiles = await fsPromises.readdir(path.join(__dirname, folder), {withFileTypes: true});
    for (const file of assetsFiles) {
        if (file.isFile()) {
            await fsPromises.copyFile(path.join(__dirname, folder, file.name), path.join(path.join(__dirname, 'project-dist'), folder, file.name))
        }
        if (file.isDirectory()) {
            await copyAssets(path.join(folder, file.name))
        }
    }
}



buildWeb()