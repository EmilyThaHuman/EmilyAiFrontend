import fs from 'fs';
import path from 'path';

// Directory where the files will be created
const dir = './resources';

// Ensure the directory exists or create it
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// Loop to create 10 files
for (let i = 1; i <= 10; i++) {
    const fileName = `${i}_.jsx`;
    const filePath = path.join(dir, fileName);

    const jsxContent = `
import React from 'react';

const Component${i} = () => {
    return (
        <div>
            <h1>This is component ${i}</h1>
        </div>
    );
};

export default Component${i};
    `;

    fs.writeFileSync(filePath, jsxContent.trim(), 'utf8');
    console.log(`Created ${fileName}`);
}
