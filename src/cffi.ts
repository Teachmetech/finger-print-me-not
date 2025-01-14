import koffi from 'koffi';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

interface RequestFunction {
    async: (payload: string, callback: (error: Error | null, response: string) => void) => void;
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const fileExt = (() => {
    if (process.platform === 'darwin') {
        return process.arch === 'arm64' ? '-arm64.dylib' : '-x86.dylib';
    } else if (process.platform === 'win32') {
        return process.arch === 'x64' ? '-64.dll' : '-32.dll';
    } else {
        if (process.arch === 'arm64') {
            return '-arm64.so';
        } else if (process.arch === 'x64') {
            return '-x86.so';
        } else {
            return '-amd64.so';
        }
    }
})();

const libraryPath = `${__dirname}/dependencies/finger-print-me-not${fileExt}`;

// Debugging: Log the library path
console.log('Loading library from:', libraryPath);

// Load the library and define the function signature
const lib = koffi.load(libraryPath);
export const request: RequestFunction = lib.func('request', 'str', ['str']);
