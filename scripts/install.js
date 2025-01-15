import { createRequire } from 'module';
import { platform, arch } from 'os';
import { join } from 'path';
import { mkdir, copyFile } from 'fs/promises';

const require = createRequire(import.meta.url);

async function install() {
    const currentPlatform = platform();
    const currentArch = arch();

    // Map platform and arch to package name
    const platformMap = {
        win32: {
            x64: 'win32-x64',
            ia32: 'win32-ia32'
        },
        linux: {
            x64: 'linux-x64',
            arm64: 'linux-arm64'
        },
        darwin: {
            x64: 'darwin-x64',
            arm64: 'darwin-arm64'
        }
    };

    const platformKey = platformMap[currentPlatform]?.[currentArch];
    if (!platformKey) {
        console.error(`Unsupported platform: ${currentPlatform}-${currentArch}`);
        process.exit(1);
    }

    try {
        const packageName = `fingerprint-me-not-${platformKey}`;
        const dependency = require(packageName);

        // Create dependencies directory if it doesn't exist
        await mkdir(join(__dirname, '..', 'dist', 'dependencies'), { recursive: true });

        // Copy the binary to the dependencies directory
        await copyFile(
            dependency.binaryPath,
            join(__dirname, '..', 'dist', 'dependencies', dependency.binaryName)
        );
    } catch (error) {
        // Optional dependency not installed, that's ok
        console.log(`Optional dependency for ${platformKey} not installed`);
    }
}

install().catch(console.error); 