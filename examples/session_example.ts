import { FingerPrintMeNotClient } from '../src/index.js';

async function main() {
    // Create a session with Chrome 108 fingerprint
    const session = new FingerPrintMeNotClient.Session({
        clientIdentifier: 'chrome_108'
    });

    // Session will maintain cookies between requests
    const response1 = await session.get('https://httpbin.org/cookies/set/sessioncookie/123456');
    console.log('Set cookie response:', response1.json);

    const response2 = await session.get('https://httpbin.org/cookies');
    console.log('Cookies in session:', response2.json);

    // Using proxy with session
    // session.proxy = 'http://user:pass@proxy.example.com:8080';
    // const response3 = await session.get('https://api.ipify.org?format=json');
    // console.log('IP through proxy:', response3.json);
}

main().catch(console.error); 