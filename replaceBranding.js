const fs = require('fs');
const path = require('path');

const clientDir = path.join(__dirname, 'client');
const files = fs.readdirSync(clientDir).filter(f => f.endsWith('.html'));

files.forEach(f => {
    let p = path.join(clientDir, f);
    let content = fs.readFileSync(p, 'utf8');
    
    // Replace Ayus<span>kama</span> with Ayuskama (case-insensitive, handles any spacing)
    const newContent = content.replace(/Ayus\s*<span>\s*kama\s*<\/span>/gi, 'Ayuskama');
    
    if (newContent !== content) {
        fs.writeFileSync(p, newContent);
        console.log('Updated branding in ' + f);
    }
});
