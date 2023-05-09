const path = require('path');
const fs = require('fs');
const {stdin, stdout} = process;

function writeText(dir) {
    
    fs.stat(dir, err => {
        if (err) fs.createWriteStream(dir, 'utf-8')
    });

    stdout.write('Please, write something here :))\n')
    stdout.on('error', err => {
        if (err) throw err;
    });
    stdin.on('data', data => {
        if (data.toString().trim() === 'exit') {
            stdout.write('Session is over. Bye!');
            process.exit();
        }
        fs.appendFile(
            dir,
            data,
            err => {
                if (err) throw err
            }
        )
    });
    process.on('SIGINT', () => {
        stdout.write('Session is over. Bye!');
        process.exit()
    });
}

writeText(path.resolve(__dirname, 'text.txt'))
