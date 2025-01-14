import { FingerPrintMeNotClient } from '../src/index.js';

async function main() {
    // Create a session with default Chrome fingerprint
    const session = new FingerPrintMeNotClient.Session({
        clientIdentifier: 'chrome_108'
    });

    // Debug log the session
    console.log('Created session with options:', {
        clientIdentifier: session['sessionOptions'].clientIdentifier,
        sessionId: session['sessionId']
    });

    // Basic GET request
    const response1 = await session.get('https://api.ipify.org?format=json');
    console.log('Your IP:', response1.json);

    // POST request with JSON data
    const response2 = await session.post('https://httpbin.org/post', {
        json: {
            hello: 'world'
        }
    });
    console.log('POST response:', response2.json);

    // GET request with custom headers
    const response3 = await session.get('https://httpbin.org/headers', {
        headers: {
            'X-Custom-Header': 'custom value'
        }
    });
    console.log('Headers received:', response3.json);
}

main().catch(console.error); 