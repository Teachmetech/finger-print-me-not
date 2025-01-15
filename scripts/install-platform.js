import { platform, arch } from 'os';
import { execSync } from 'child_process';

const ALL_PACKAGES = [
    'fingerprint-me-not-win32-x64',
    'fingerprint-me-not-win32-ia32',
    'fingerprint-me-not-linux-x64',
    'fingerprint-me-not-linux-x86',
    'fingerprint-me-not-linux-arm64',
    'fingerprint-me-not-darwin-x64',
    'fingerprint-me-not-darwin-arm64'
];

function installPlatformDependency() {
    // Check if INSTALL_ALL_PLATFORMS is set
    if (process.env.INSTALL_ALL_PLATFORMS === 'true') {
        console.log('Installing all platform dependencies...');
        for (const pkg of ALL_PACKAGES) {
            try {
                execSync(`npm install ${pkg}@${process.env.npm_package_version}`, { stdio: 'inherit' });
            } catch (error) {
                console.error(`Failed to install platform dependency: ${pkg}`);
            }
        }
        return;
    }

    const currentPlatform = platform();
    const currentArch = arch();

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
        try {
            execSync(`npm install ${packageName}@${process.env.npm_package_version}`, { stdio: 'inherit' });
        } catch (error) {
            console.error(`Failed to install platform dependency: ${packageName}`);
            process.exit(1);
        }
    }
}

installPlatformDependency(); 