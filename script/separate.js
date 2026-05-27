const fs = require('fs');

// The files you want to process
const files = ['admin.html', 'index.html', 'student.html', 'teacher.html'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    let content = fs.readFileSync(file, 'utf8');
    const baseName = file.replace('.html', '');

    // Extract and replace CSS
    const styleRegex = /<style>([\s\S]*?)<\/style>/i;
    const styleMatch = content.match(styleRegex);
    if (styleMatch) {
        fs.writeFileSync(`${baseName}.css`, styleMatch[1].trim());
        content = content.replace(styleRegex, `<link rel="stylesheet" href="${baseName}.css">`);
    }

    // Extract and replace JavaScript
    const scriptRegex = /<script>([\s\S]*?)<\/script>/i;
    const scriptMatch = content.match(scriptRegex);
    if (scriptMatch) {
        fs.writeFileSync(`${baseName}.js`, scriptMatch[1].trim());
        content = content.replace(scriptRegex, `<script src="${baseName}.js"></script>`);
    }

    // Save the updated HTML
    fs.writeFileSync(file, content);
    console.log(`Successfully separated: ${file} into ${baseName}.css and ${baseName}.js`);
});