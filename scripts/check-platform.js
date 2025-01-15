import { platform, arch } from 'os';

function getPlatformInfo() {
    const currentPlatform = platform();
    const currentArch = arch();

    console.log('\nSystem Information:');
    console.log('------------------');
    console.log(`Platform: ${currentPlatform}`);
    console.log(`Architecture: ${currentArch}`);

    let packageName = '';

    if (currentPlatform === 'win32') {
        packageName = currentArch === 'x64'
            ? 'fingerprint-me-not-win32-x64'
            : 'fingerprint-me-not-win32-ia32';
    } else if (currentPlatform === 'linux') {
        if (currentArch === 'x64') {
            packageName = 'fingerprint-me-not-linux-x64';
        } else if (currentArch === 'arm64') {
            packageName = 'fingerprint-me-not-linux-arm64';
        } else if (currentArch === 'ia32') {
            packageName = 'fingerprint-me-not-linux-x86';
        }
    } else if (currentPlatform === 'darwin') {
        packageName = currentArch === 'arm64'
            ? 'fingerprint-me-not-darwin-arm64'
            : 'fingerprint-me-not-darwin-x64';
    }

    if (packageName) {
        console.log('\nRequired Package:');
        console.log('----------------');
        console.log(`npm install ${packageName}`);
    } else {
        console.log('\nWarning: Unsupported platform/architecture combination');
        console.log(`Platform '${currentPlatform}' with architecture '${currentArch}' is not supported.`);
    }
}

getPlatformInfo(); 