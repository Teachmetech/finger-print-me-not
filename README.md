## Package Information
[![npm version](https://img.shields.io/npm/v/fingerprint-me-not.svg)](https://www.npmjs.com/package/fingerprint-me-not)
[![npm downloads](https://img.shields.io/npm/dm/fingerprint-me-not.svg)](https://www.npmjs.com/package/fingerprint-me-not)
[![License](https://img.shields.io/npm/l/fingerprint-me-not.svg)](https://github.com/Teachmetech/finger-print-me-not/blob/main/LICENSE)

<p align="center">
<img src="assets/fingerprint-me-not.png" alt="FingerPrintMeNot Logo" width="200"/>
</p>

# FingerPrintMeNot

A powerful Node.js HTTP client with advanced TLS fingerprinting capabilities. This library allows you to make HTTP requests while controlling your TLS fingerprint, headers, and other connection parameters.

## What is TLS Fingerprinting?

TLS fingerprinting is a technique used by websites to detect and block automated requests. It involves analyzing the TLS handshake to identify patterns that are unique to specific clients or browsers. By controlling the TLS fingerprint, you can make requests that are indistinguishable from requests made by a real browser. Controlling the TLS fingerprint is not something that can be done with a general purpose library like [axios](https://github.com/axios/axios) or [node-fetch](https://github.com/node-fetch/node-fetch) or even python's [requests](https://github.com/psf/requests) library. This is because high level programming languages like javascript and python do not have the ability to control the TLS fingerprint. You must use a lower level programming language like C or C++ to control the TLS fingerprint. This library is built on top of the [koffi](https://github.com/Koromix/koffi) library which is a C++ library that allows you to interface with C with support for all major operating systems and architectures.

## Features

- Custom TLS fingerprinting (JA3, HTTP/2 settings)
- Session management with cookie persistence
- Proxy support
- Comprehensive error handling
- Support for all HTTP methods
- HTTP/2 support
- Custom header ordering
- Automatic JSON parsing
- TypeScript support

## Installation

```bash
npm install fingerprint-me-not
```

## Quick Start

### Basic Usage

```typescript
import { FingerPrintMeNotClient } from 'fingerprint-me-not';

// Simple GET request
const response = await FingerPrintMeNotClient.get('https://api.example.com/data');
console.log(response.json);

// POST request with JSON data
const response = await FingerPrintMeNotClient.post('https://api.example.com/data', {
    json: { hello: 'world' }
});
```

### Session Management

```typescript
const session = new FingerPrintMeNotClient.Session({
    clientIdentifier: 'chrome_108'
});

// Session maintains cookies between requests
const response1 = await session.get('https://example.com/login');
const response2 = await session.get('https://example.com/profile');
```

### Custom TLS Fingerprint

```typescript
const session = new FingerPrintMeNotClient.Session({
    ja3String: "771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-17513,29-23-24,0",
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
```

### Using Proxies

```typescript
const session = new FingerPrintMeNotClient.Session();
session.proxy = 'http://user:pass@proxy.example.com:8080';
const response = await session.get('https://api.example.com/data');
```

## API Reference

### FingerPrintMeNotClient

Static methods for quick requests:
- `get(url, options?)`
- `post(url, options?)`
- `put(url, options?)`
- `patch(url, options?)`
- `delete(url, options?)`
- `head(url, options?)`
- `options(url, options?)`

### Session Options

```typescript
interface SessionConstructorOptions {
    clientIdentifier?: string;
    ja3string?: string;
    h2Settings?: Record<string, number>;
    h2SettingsOrder?: string[];
    supportedSignatureAlgorithms?: string[];
    supportedVersions?: string[];
    keyShareCurves?: string[];
    certCompressionAlgo?: string;
    pseudoHeaderOrder?: string[];
    connectionFlow?: number;
    priorityFrames?: any[];
    headerOrder?: string[];
    headerPriority?: Record<string, number>;
    randomTlsExtensionOrder?: boolean;
    forceHttp1?: boolean;
}
```

### Request Options

```typescript
interface ExecuteRequestOptions {
    headers?: Record<string, string>;
    proxy?: string;
    json?: any;
    data?: Record<string, string>;
    params?: Record<string, string>;
    cookies?: Record<string, string>;
    allowRedirects?: boolean;
    insecureSkipVerify?: boolean;
    timeoutSeconds?: number;
}
```

## Examples

Check out the `examples` directory for more detailed examples:
- Basic requests (`examples/basic_requests.ts`)
- Session management (`examples/session_example.ts`)
- Custom fingerprinting (`examples/custom_fingerprint.ts`)
- Error handling (`examples/error_handling.ts`)
- Zalando API (`examples/zalando_example.ts`)
- Upwork API (`examples/upwork_example.ts`)

Run examples using:
```bash
npm run example:basic
npm run example:session
npm run example:fingerprint
npm run example:errors
npm run example:zalando
npm run example:upwork
```

## Error Handling

```typescript
try {
    const response = await FingerPrintMeNotClient.get('https://api.example.com');
} catch (error) {
    if (error instanceof FingerPrintMeNotClient.FingerPrintMeNotException) {
        console.error('FingerPrintMeNot Error:', error.message);
    }
}
```

## Author

Varand Abrahamian ([@teachmetech](https://github.com/teachmetech))  
contact@varand.me

## Author Notes

This library is a fork of [tls-client](https://github.com/bogdanfinn/tls-client) and [python-tls-client](https://github.com/florianregaz/python-tls-client) with some improvements and new features. I originally needed to make requests to a website that was using TLS fingerprinting to detect bots. I found the python version of the library which has been maintained by [@florianregaz](https://github.com/florianregaz) and is being kept updated. However, the javascript version was not being maintained and I was having issues with it since it had dependencies that were not being maintained. I decided to fork the library and maintain it myself. I have added some improvements and new features to the library and I am keeping it updated. Note, that this library is not the best library for making general purpose requests. It is specifically designed for making requests to websites that are using TLS fingerprinting to detect bots. If you don't need to control the TLS fingerprint, I would recommend using a more general purpose library like [axios](https://github.com/axios/axios) or [node-fetch](https://github.com/node-fetch/node-fetch).

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgements

- [tls-client](https://github.com/bogdanfinn/tls-client)
- [python-tls-client](https://github.com/florianregaz/python-tls-client)