import { FingerPrintMeNotClient } from '../src/index.js';

async function main() {
    try {
        // Simple request to test platform detection and binary loading
        const response = await FingerPrintMeNotClient.get('https://api.ipify.org?format=json');
        console.log('Success! Your IP:', response.json);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main(); 