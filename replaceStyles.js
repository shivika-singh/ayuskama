const fs = require('fs');
const path = require('path');

const clientDir = path.join(__dirname, 'client');
const files = fs.readdirSync(clientDir).filter(f => f.endsWith('.html'));

const oldRootRegex = /:root\s*\{[^}]+\}/;
const newRoot = `:root {
            --primary: #4CAF50;
            --primary-light: #81C784;
            --primary-dark: #388E3C;
            --accent: #C5A059;
            --bg-color: #fdfdfd;
            --card-bg: rgba(255, 255, 255, 0.85);
            --text-main: #1a1a1a;
            --text-muted: #666666;
            --border: #e8e8e8;
            --hover-bg: #f4f6f4;
        }`;

const globalOverrides = `
        h1, h2, h3, h4, h5, h6, .brand-logo, .option-title, .section-title {
            font-family: 'Cormorant Garamond', serif !important;
        }
        body, p, span, a, div, button, input {
            font-family: 'Montserrat', sans-serif;
        }
`;

files.forEach(f => {
    let p = path.join(clientDir, f);
    let content = fs.readFileSync(p, 'utf8');

    // Update Fonts Link
    content = content.replace(
        /<link href="https:\/\/fonts.googleapis.com\/css2\?family=Outfit[^"]*" rel="stylesheet">/g,
        '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">'
    );

    // Replace old font-family definitions
    content = content.replace(/font-family:\s*'Outfit',\s*sans-serif;/g, '');

    // Replace root variables
    if (oldRootRegex.test(content)) {
        content = content.replace(oldRootRegex, newRoot + globalOverrides);
    }

    fs.writeFileSync(p, content);
    console.log('Updated styles in ' + f);
});
