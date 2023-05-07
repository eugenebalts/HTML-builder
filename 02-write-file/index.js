const path = require('path');
const fs = require('fs');
const {stdin, stdout} = process;

function writeText(dir) {
    stdout.write('Please, write something here :))\n')
    stdout.on('error', err => {
        if (err) throw err;
    });
    stdin.on('data', data => {
        if (data.toString().trim() === 'exit') process.exit();
        fs.appendFile(
            dir,
            data,
            err => {
                if (err) throw err
            }
        )
    });
    process.on('exit', () => stdout.write('Session is over. Bye!'));
}

writeText(path.resolve(__dirname, 'text.txt'))
