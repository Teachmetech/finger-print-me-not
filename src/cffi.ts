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

const libraryPath = process.env.NODE_ENV === 'development'
    ? `${__dirname}/dependencies/finger-print-me-not${fileExt}`
    : `${dirname(__dirname)}/dependencies/finger-print-me-not${fileExt}`;

// Debugging: Log the library path
// console.log('Loading library from:', libraryPath);

// Load the library and define the function signature
let request: RequestFunction;
try {
    const lib = koffi.load(libraryPath);
    request = lib.func('request', 'str', ['str']);
} catch (error) {
    throw new Error(
        `Failed to load native dependency for ${process.platform}-${process.arch}. ` +
        `Please install the required dependency: npm install fingerprint-me-not-${process.platform}-${process.arch}`
    );
}

export { request };
