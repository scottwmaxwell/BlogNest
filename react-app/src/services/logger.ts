import { Logger } from 'tslog';

// Define log structure
interface MyLogObj {
    message: string;
    level: string;
    timestamp: string;
}

// Initialize tslog logger with custom log structure
const logger: Logger<MyLogObj> = new Logger({stylePrettyLogs: false});

export default logger;

