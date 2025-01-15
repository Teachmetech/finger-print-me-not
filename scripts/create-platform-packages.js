import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const mainPackage = require('../package.json');

const platforms = {
    'win32-x64': {
        binary: 'finger-print-me-not-64.dll',
        os: ['win32'],
        cpu: ['x64']
    },
    'win32-ia32': {
        binary: 'finger-print-me-not-32.dll',
        os: ['win32'],
        cpu: ['ia32']
    },
    'linux-x64': {
        binary: 'finger-print-me-not-amd64.so',
        os: ['linux'],
        cpu: ['x64']
    },
    'linux-x86': {
        binary: 'finger-print-me-not-x86.so',
        os: ['linux'],
        cpu: ['x86']
    },
    'linux-arm64': {
        binary: 'finger-print-me-not-arm64.so',
        os: ['linux'],
        cpu: ['arm64']
    },
    'darwin-x64': {
        binary: 'finger-print-me-not-x86.dylib',
        os: ['darwin'],
        cpu: ['x64']
    },
    'darwin-arm64': {
        binary: 'finger-print-me-not-arm64.dylib',
        os: ['darwin'],
        cpu: ['arm64']
    }
};

async function createPackages() {
    for (const [platform, config] of Object.entries(platforms)) {
        const packageDir = join('packages', `fingerprint-me-not-${platform}`);
        await mkdir(packageDir, { recursive: true });

        const packageJson = {
            name: `fingerprint-me-not-${platform}`,
            version: mainPackage.version,
            description: `${platform} binaries for fingerprint-me-not`,
            repository: {
                type: 'git',
                url: 'git+https://github.com/Teachmetech/finger-print-me-not.git'
            },
            os: config.os,
            cpu: config.cpu,
            files: [config.binary],
            binaryName: config.binary,
            binaryPath: `./${config.binary}`,
            license: 'MIT'
        };

        await writeFile(
            join(packageDir, 'package.json'),
            JSON.stringify(packageJson, null, 2)
        );
    }
}

createPackages().catch(console.error); 