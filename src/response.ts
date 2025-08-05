import { STATUS_CODES } from 'http';
import { CookieJar } from 'tough-cookie';
import { FingerPrintMeNotException } from './exceptions.js';

// Common binary content types
const BINARY_CONTENT_TYPES = [
    'application/pdf',
    'application/zip',
    'application/octet-stream',
    'image/',
    'video/',
    'audio/',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument',
    'application/x-binary',
    'application/x-msdownload',
    'application/x-executable'
];

function isBinaryContentType(contentType: string): boolean {
    if (!contentType) return false;
    const lowerContentType = contentType.toLowerCase();
    return BINARY_CONTENT_TYPES.some(binaryType => lowerContentType.includes(binaryType));
}

export class Response {
    url: string;
    ok: boolean;
    status: number;
    reason: string | undefined;
    raiseForStatus: () => void;
    headers: Record<string, string>;
    cookies: CookieJar;
    content: Buffer;
    text: string;
    json: any;
    isBinary: boolean;

    constructor(response: any, cookies: CookieJar) {
        this.url = response.target;
        this.ok = response.status >= 200 && response.status < 300;
        this.status = response.status;
        this.reason = STATUS_CODES[response.status];
        this.raiseForStatus = () => {
            if (!this.ok) {
                throw new FingerPrintMeNotException(`Request failed with status code ${this.status}`);
            }
        };
        this.headers = Object.fromEntries(Object.entries(response.headers).map(([key, value]) => [key, (value as string[]).join(', ')]));
        this.cookies = cookies;
        
        // Determine if this is binary content
        const contentType = this.headers['Content-Type'] || this.headers['content-type'] || '';
        this.isBinary = isBinaryContentType(contentType);
        
        // Handle binary vs text content appropriately
        // Check for body_len which indicates base64-encoded binary data from native code
        if (response.body_len && typeof response.body_len === 'number') {
            // Native code has sent base64-encoded binary data in response.body
            // response.body_len contains the original raw data length
            try {
                // Ensure the base64 string hasn't been corrupted by UTF-8 processing
                const base64Body = response.body || '';
                
                // Validate base64 format and clean it if necessary
                const cleanBase64 = base64Body.replace(/[^A-Za-z0-9+/=]/g, '');
                
                if (cleanBase64 !== base64Body) {
                    console.warn('Warning: Base64 data was corrupted during UTF-8 processing. Attempting to clean.');
                }
                
                this.content = Buffer.from(cleanBase64, 'base64');
                this.text = ''; // Binary content should not be treated as text
                this.isBinary = true;
                
                // Verify the decoded length matches expected length
                if (this.content.length !== response.body_len) {
                    console.warn(`Warning: Decoded binary length (${this.content.length}) doesn't match expected length (${response.body_len}). Data may be corrupted.`);
                }
            } catch (error) {
                console.error('Error decoding base64 binary data:', error);
                // Fallback to treating as text
                this.content = Buffer.from(response.body || '', 'utf-8');
                this.text = response.body || '';
                this.isBinary = false;
            }
        } else if (this.isBinary) {
            // Binary content detected by content-type but no body_len (legacy/fallback)
            console.warn(`Warning: Binary content detected (${contentType}) but no body_len field. Content may be truncated at null bytes.`);
            this.content = Buffer.from(response.body || '', 'binary');
            this.text = response.body || '';
        } else {
            // Text content
            this.content = Buffer.from(response.body || '', 'utf-8');
            this.text = response.body || '';
        }
        
        this.json = null;
        
        // Parse JSON if content type indicates JSON and it's not binary
        if (!this.isBinary && contentType.includes('application/json')) {
            try {
                this.json = JSON.parse(this.text);
            } catch (e) {
                // Ignore JSON parse errors
            }
        }
    }
    
    /**
     * Get the response content as a Buffer (recommended for binary data)
     */
    getBuffer(): Buffer {
        return this.content;
    }
    
    /**
     * Get the response content as text (only recommended for text content)
     */
    getText(): string {
        if (this.isBinary) {
            console.warn('Warning: Attempting to get binary content as text. Use getBuffer() instead.');
        }
        return this.text;
    }
    
    /**
     * Check if the response contains binary content
     */
    isBinaryContent(): boolean {
        return this.isBinary;
    }
} 