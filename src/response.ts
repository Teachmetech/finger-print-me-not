import { STATUS_CODES } from 'http';
import { CookieJar } from 'tough-cookie';
import { FingerPrintMeNotException } from './exceptions.js';

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
        this.content = Buffer.from(response.body, 'utf-8');
        this.text = response.body;
        this.json = null;

        if (this.headers['Content-Type']?.includes('application/json')) {
            try {
                this.json = JSON.parse(response.body);
            } catch (e) {
                // Ignore JSON parse errors
            }
        }
    }
} 