import { randomUUID } from 'crypto';
import { createRequire } from 'module';
import { CookieJar } from 'tough-cookie';
import { request } from './cffi.js';
import { FingerPrintMeNotException } from './exceptions.js';
import { Response } from './response.js';
import { ExecuteRequestOptions, Headers, Params, RequestPayload, SessionConstructorOptions } from './types.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

export class Session {
    private sessionId: string;
    headers: Headers = {};
    proxy: string = '';
    params: Params = {};
    cookies: CookieJar;
    private sessionOptions: SessionConstructorOptions;

    constructor(options: SessionConstructorOptions = {}) {
        this.sessionId = randomUUID();
        this.headers = {
            'User-Agent': `finger-print-me-not/${version}`,
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept': '*/*',
            'Connection': 'keep-alive',
        };
        this.proxy = '';
        this.params = {};
        this.cookies = new CookieJar();
        this.sessionOptions = options;
    }

    private async executeRequest(method: string, url: string, options: ExecuteRequestOptions = {}): Promise<Response> {
        if (options?.params) {
            url += `?${new URLSearchParams(options.params).toString()}`;
        }

        let requestBody;
        let contentType;
        if (options?.json) {
            requestBody = JSON.stringify(options.json);
            contentType = 'application/json';
        } else if (options?.data) {
            requestBody = new URLSearchParams(Object.entries(options.data)).toString();
            contentType = 'application/x-www-form-urlencoded';
        }

        if (contentType) {
            this.headers['Content-Type'] = contentType;
        }

        let headers = this.headers;
        if (options?.headers) {
            headers = { ...this.headers, ...options.headers };
        }

        let cookies = this.cookies;
        if (options?.cookies) {
            for (const [cookieKey, cookieValue] of Object.entries(options.cookies)) {
                await this.cookies.setCookie(`${cookieKey}=${cookieValue}`, url);
            }
            cookies = this.cookies;
        }

        headers['Cookie'] = await cookies.getCookieString(url);

        let proxy = this.proxy;
        if (options?.proxy) {
            proxy = options.proxy;
        }

        const requestPayload: RequestPayload = {
            sessionId: this.sessionId,
            followRedirects: options?.allowRedirects || false,
            forceHttp1: this.sessionOptions.forceHttp1 || false,
            headers,
            headerOrder: this.sessionOptions.headerOrder,
            insecureSkipVerify: options?.insecureSkipVerify || false,
            isByteRequest: false,
            proxyUrl: proxy,
            requestUrl: url,
            requestMethod: method.toUpperCase(),
            requestBody,
            requestCookies: [],
            timeoutSeconds: options?.timeoutSeconds || 30,
        };

        if (Object.keys(this.sessionOptions || {}).length) {
            if (this.sessionOptions.clientIdentifier) {
                requestPayload.tlsClientIdentifier = this.sessionOptions.clientIdentifier;
                requestPayload.withRandomTLSExtensionOrder = this.sessionOptions.randomTlsExtensionOrder || false;
            } else {
                requestPayload.customTlsClient = {
                    ja3String: this.sessionOptions.ja3string,
                    h2Settings: this.sessionOptions.h2Settings,
                    h2SettingsOrder: this.sessionOptions.h2SettingsOrder,
                    supportedSignatureAlgorithms: this.sessionOptions.supportedSignatureAlgorithms,
                    supportedVersions: this.sessionOptions.supportedVersions,
                    keyShareCurves: this.sessionOptions.keyShareCurves,
                    certCompressionAlgo: this.sessionOptions.certCompressionAlgo,
                    pseudoHeaderOrder: this.sessionOptions.pseudoHeaderOrder,
                    connectionFlow: this.sessionOptions.connectionFlow,
                    priorityFrames: this.sessionOptions.priorityFrames,
                    headerOrder: this.sessionOptions.headerOrder,
                    headerPriority: this.sessionOptions.headerPriority,
                };
            }
        } else {
            requestPayload.tlsClientIdentifier = 'chrome_108';
            requestPayload.withRandomTLSExtensionOrder = false;
        }

        const response = await new Promise<string>((resolve, reject) => {
            request.async(JSON.stringify(requestPayload), (error: Error | null, response: string) => {
                if (error) reject(error);
                else resolve(response);
            });
        });

        if (!response) {
            throw new FingerPrintMeNotException('No response received');
        }

        const responseObject = JSON.parse(response);
        if (responseObject.status === 0) {
            throw new FingerPrintMeNotException(responseObject.body);
        }

        const responseCookieJar = new CookieJar();
        if (responseObject.headers['Set-Cookie'] && Array.isArray(responseObject.headers['Set-Cookie'])) {
            for (const cookie of responseObject.headers['Set-Cookie']) {
                await responseCookieJar.setCookie(cookie, url);
            }
        }

        return new Response(responseObject, responseCookieJar);
    }

    async get(url: string, options?: ExecuteRequestOptions): Promise<Response> {
        return this.executeRequest('GET', url, options);
    }

    async post(url: string, options?: ExecuteRequestOptions): Promise<Response> {
        return this.executeRequest('POST', url, options);
    }

    async put(url: string, options?: ExecuteRequestOptions): Promise<Response> {
        return this.executeRequest('PUT', url, options);
    }

    async patch(url: string, options?: ExecuteRequestOptions): Promise<Response> {
        return this.executeRequest('PATCH', url, options);
    }

    async delete(url: string, options?: ExecuteRequestOptions): Promise<Response> {
        return this.executeRequest('DELETE', url, options);
    }

    async head(url: string, options?: ExecuteRequestOptions): Promise<Response> {
        return this.executeRequest('HEAD', url, options);
    }

    async options(url: string, options?: ExecuteRequestOptions): Promise<Response> {
        return this.executeRequest('OPTIONS', url, options);
    }
} 