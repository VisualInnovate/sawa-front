const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const vueFiles = [];
walk('src/views', (filePath) => {
    if (filePath.endsWith('.vue')) {
        vueFiles.push(filePath);
    }
});

let modifiedFiles = 0;

for (const file of vueFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // Replace escaped backticks with unescaped ones
    content = content.replace(/\\`\$\{\$t\('Showing'\)\}/g, "`\${$t('Showing')}");
    content = content.replace(/\$t\('([^']+)'\)\}\\`/g, "$t('$1')}`");

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedFiles++;
        console.log('Fixed: ' + file);
    }
}
console.log('Total files fixed: ' + modifiedFiles);
