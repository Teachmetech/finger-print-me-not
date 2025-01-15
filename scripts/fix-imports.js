import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function fixImports() {
    const files = [
        'dist/cffi.js',
        'dist/esm/cffi.js'
    ];

    for (const file of files) {
        try {
            const content = await readFile(file, 'utf8');
            const updated = content.replace(
                /dependencies\/finger-print-me-not/g,
                'dependencies/finger-print-me-not'
            );
            await writeFile(file, updated);
        } catch (error) {
            console.error(`Error processing ${file}:`, error);
        }
    }
}

fixImports().catch(console.error); 