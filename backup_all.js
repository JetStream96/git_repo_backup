const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

function hasDuplicate(arr) {
    let existing = {};
    arr.forEach(i => {
        if (!existing[i]) return [true, i];
        existing[i] = 1;
    })
    return [false, null];
}

function main() {
    let data = fs.readFileSync('./git_repo_list.json');
    let list = JSON.parse(data)['list'];
    let len = list.length;
    let [hasDup, dupName] = hasDuplicate(list.map(i => i['name']));

    if (hasDup) {
        console.log('Duplicate name: ' + dupName);
        return;
    }

    if (!fs.existsSync('./out')) {
        fs.mkdirSync('./out');
    } else {
        console.log('Directory "out" already exits. Please delete before continue.');
        process.exit(1);
    }

    let completed = 0;

    list.forEach(entry => {
        let name = entry['name'];
        exec('git clone ' + entry['url'] + ' --no-checkout',
            { cwd: path.join(__dirname, 'out') },
            (e, out, err) => {
                if (e) {
                    console.log(e);
                    process.exit(1);
                }

                console.log(out);
                if (err) console.log(err);
                completed++;
                if (completed === len) {
                    console.log('Completed.');
                    process.exit(0);
                }
            })
    })
}

main();
