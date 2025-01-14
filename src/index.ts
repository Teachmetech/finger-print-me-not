import { FingerPrintMeNotException } from './exceptions.js';
import { Response } from './response.js';
import { Session } from './sessions.js';
import { ExecuteRequestOptions } from './types.js';

const DEFAULT_CLIENT = 'chrome_108';

export const FingerPrintMeNotClient = {
    Session,
    Response,
    FingerPrintMeNotException,
    async get(url: string, options?: ExecuteRequestOptions): Promise<Response> {
        const session = new Session({ clientIdentifier: DEFAULT_CLIENT });
        return await session.get(url, options);
    },
    async post(url: string, options?: ExecuteRequestOptions): Promise<Response> {
        const session = new Session({ clientIdentifier: DEFAULT_CLIENT });
        return await session.post(url, options);
    },
    async put(url: string, options?: ExecuteRequestOptions): Promise<Response> {
        const session = new Session({ clientIdentifier: DEFAULT_CLIENT });
        return await session.put(url, options);
    },
    async patch(url: string, options?: ExecuteRequestOptions): Promise<Response> {
        const session = new Session({ clientIdentifier: DEFAULT_CLIENT });
        return await session.patch(url, options);
    },
    async delete(url: string, options?: ExecuteRequestOptions): Promise<Response> {
        const session = new Session({ clientIdentifier: DEFAULT_CLIENT });
        return await session.delete(url, options);
    },
    async head(url: string, options?: ExecuteRequestOptions): Promise<Response> {
        const session = new Session({ clientIdentifier: DEFAULT_CLIENT });
        return await session.head(url, options);
    },
    async options(url: string, options?: ExecuteRequestOptions): Promise<Response> {
        const session = new Session({ clientIdentifier: DEFAULT_CLIENT });
        return await session.options(url, options);
    }
};

export default FingerPrintMeNotClient; 