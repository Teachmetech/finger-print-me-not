import { FingerPrintMeNotClient } from '../src/index.js';

async function main() {
    try {
        const session = new FingerPrintMeNotClient.Session({
            ja3string: "771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-17513,29-23-24,0",
            h2Settings: {
                "HEADER_TABLE_SIZE": 65536,
                "MAX_CONCURRENT_STREAMS": 1000,
                "INITIAL_WINDOW_SIZE": 6291456,
                "MAX_HEADER_LIST_SIZE": 262144
            },
            h2SettingsOrder: [
                "HEADER_TABLE_SIZE",
                "MAX_CONCURRENT_STREAMS",
                "INITIAL_WINDOW_SIZE",
                "MAX_HEADER_LIST_SIZE"
            ],
            supportedSignatureAlgorithms: [
                "ECDSAWithP256AndSHA256",
                "PSSWithSHA256",
                "PKCS1WithSHA256",
                "ECDSAWithP384AndSHA384",
                "PSSWithSHA384",
                "PKCS1WithSHA384",
                "PSSWithSHA512",
                "PKCS1WithSHA512",
            ],
            supportedVersions: ["GREASE", "1.3", "1.2"],
            keyShareCurves: ["GREASE", "X25519"],
            certCompressionAlgo: "brotli",
            pseudoHeaderOrder: [
                ":method",
                ":authority",
                ":scheme",
                ":path"
            ],
            connectionFlow: 15663105,
            headerOrder: [
                "accept",
                "user-agent",
                "accept-encoding",
                "accept-language"
            ]
        });

        // Set headers for JSON response
        const headers = {
            'Accept': 'application/json'
        };

        // Test the custom fingerprint
        const response = await session.get('https://tls.peet.ws/api/all', { headers });
        
        if (!response.json) {
            console.error('No data received in response');
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            console.log('Response text:', response.text);
            return;
        }

        console.log('TLS Fingerprint details:', response.json);
    } catch (error) {
        console.error('Error:', error);
        if (error instanceof FingerPrintMeNotClient.FingerPrintMeNotException) {
            console.error('FingerPrintMeNot Error:', error.message);
        }
    }
}

main().catch(console.error); 