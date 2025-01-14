import { FingerPrintMeNotClient } from '../src/index.js';

async function main() {
    try {
        // Attempt request to non-existent domain
        await FingerPrintMeNotClient.get('https://this-domain-does-not-exist.com');
    } catch (error) {
        if (error instanceof FingerPrintMeNotClient.FingerPrintMeNotException) {
            console.error('FingerPrintMeNot Error:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }

    try {
        // Attempt request with invalid proxy
        const session = new FingerPrintMeNotClient.Session();
        session.proxy = 'http://invalid-proxy:1234';
        await session.get('https://example.com');
    } catch (error) {
        if (error instanceof FingerPrintMeNotClient.FingerPrintMeNotException) {
            console.error('Proxy Error:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}

main().catch(console.error); 