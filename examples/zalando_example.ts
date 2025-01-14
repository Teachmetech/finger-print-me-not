import { FingerPrintMeNotClient } from '../src/index.js';

async function main() {
    try {

        const response = await FingerPrintMeNotClient.get(
            'https://en.zalando.de/api/navigation',
        );
        
        console.log('Status Code:', response.status);

        if (response.json) {
            console.log('Response Data:', response.json);
        }
    } catch (error) {
        if (error instanceof FingerPrintMeNotClient.FingerPrintMeNotException) {
            console.error('FingerPrintMeNot Error:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}

main().catch(console.error); 