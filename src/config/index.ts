export { ormConfig } from './ormconfig';

export const JWT_SECRET = process.env.JWT_SECRET;
export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;
export const IS_PRODUCTION = NODE_ENV === 'production';
export const GMAIL_ADDRESS = process.env.GMAIL_ADDRESS;
export const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;
