const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
// const {copyFile, readdir, mkdir, rm} = require('node:fs/promises');


//CONSTANTS
const compsFolder = path.join(__dirname, 'components');
const projectDist = path.join(__dirname, 'project-dist');

async function recreateFolder(folder) {
    try { // delete and create if there is folder
        const folderContent = await fsPromises.readdir(folder, {withFileTypes: true}, err => {
            if (err) return;
        });
        for (const file of folderContent) {
            const dirToFile = path.join(folder, file.name)
            file.isFile() ? await fsPromises.rm(dirToFile) : await recreateFolder(dirToFile)
        }
    
        await fsPromises.rmdir(folder)
        await fsPromises.mkdir(path.join(__dirname, 'project-dist'), err => {
            if (err) throw err;
        });
        
    } catch(err) { //if there is no folder just create it 
        await fsPromises.mkdir(path.join(__dirname, 'project-dist'), err => {
            if (err) throw err;
        });
    }
}

async function buildWeb() {
    // 2 HTML 
    await recreateFolder(projectDist);
        // CREATE FILE HTML
        const indexHtml = fs.createWriteStream(path.join(projectDist, 'index.html'), 'utf-8');
        // READ COMPONENTS
        const compsFiles = await fsPromises.readdir(compsFolder, {withFileTypes: true});
        const semantics = {};
        compsFiles.filter(file => file.isFile())
        for (const file of compsFiles) {
            semanticsName = file.name.split('.')[0];
            semantics[semanticsName] = await fsPromises.readFile(path.join(compsFolder, file.name), 'utf-8');
        }
        const template = await fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf-8');
        let templateContent = template;
        for (const prop in semantics) {
            templateContent = templateContent.replace(`{{${prop}}}`, semantics[prop])
        }
        indexHtml.write(templateContent);

    // 3 Merge styles - Done
    const writableSteam = fs.createWriteStream(path.join(projectDist, 'style.css'), 'utf-8');
    const styles = await fsPromises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true})
    styles.filter(file => file.isFile())
    .filter(file => path.extname(file.name) === '.css')
    .forEach(file => {
        const readableStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
        readableStream.on('data', data => {
            writableSteam.write(data)
        })
    })
}

buildWeb()