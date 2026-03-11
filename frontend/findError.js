const fs = require('fs');
const txt = fs.readFileSync('lint_output.txt', 'ucs2');
const lines = txt.split('\n');
lines.forEach((l, i) => {
    if (l.includes('setFilter')) {
        console.log(lines[i-2], lines[i-1], l, lines[i+1], lines[i+2]);
    }
});
