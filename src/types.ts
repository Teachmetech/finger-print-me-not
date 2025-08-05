export interface ExecuteRequestOptions {
    headers?: Record<string, string>;
    proxy?: string;
    json?: any;
    data?: Record<string, string>;
    params?: Record<string, string>;
    cookies?: Record<string, string>;
    allowRedirects?: boolean;
    insecureSkipVerify?: boolean;
    timeoutSeconds?: number;
    isBinaryRequest?: boolean; // Request binary content (auto-detects if not specified)
}

export interface Headers {
    [key: string]: string;
}

export interface Params {
    [key: string]: string | number | boolean;
}

export interface SessionConstructorOptions {
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
    ignoreResponseCookies?: boolean;
}

export interface RequestPayload {
    sessionId: string;
    followRedirects: boolean;
    forceHttp1: boolean;
    headers: Headers;
    headerOrder?: string[];
    insecureSkipVerify: boolean;
    isByteRequest: boolean;
    proxyUrl: string;
    requestUrl: string;
    requestMethod: string;
    requestBody?: string;
    requestCookies: string[];
    timeoutSeconds: number;
    tlsClientIdentifier?: string;
    withRandomTLSExtensionOrder?: boolean;
    customTlsClient?: {
        ja3String?: string;
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
    };
} 