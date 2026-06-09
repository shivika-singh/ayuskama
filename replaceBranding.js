const fs = require('fs');
const path = require('path');

const clientDir = path.join(__dirname, 'client');
const files = fs.readdirSync(clientDir).filter(f => f.endsWith('.html'));

files.forEach(f => {
    let p = path.join(clientDir, f);
    let content = fs.readFileSync(p, 'utf8');
    
    // Replace the styled header with logo + Ayuskama
    content = content.replace(
        /<h1>Ayur<span>Care<\/span><\/h1>/g, 
        '<h1 style="display: flex; align-items: center; gap: 12px; justify-content: inherit;"><img src="assets/logo.jpg" alt="Logo" style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.1);"> Ayus<span>kama</span></h1>'
    );
    
    // Some headers might have slightly different spacing
    content = content.replace(
        /<h2>Ayur<span>Care<\/span><\/h2>/g, 
        '<h2 style="display: flex; align-items: center; gap: 12px; justify-content: inherit;"><img src="assets/logo.jpg" alt="Logo" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.1);"> Ayus<span>kama</span></h2>'
    );
    
    // Replace all other instances
    content = content.replace(/AyurCare/g, 'Ayuskama');
    content = content.replace(/Ayurcare/g, 'Ayuskama');
    content = content.replace(/ayurcare/g, 'ayuskama');

    fs.writeFileSync(p, content);
    console.log('Updated ' + f);
});
