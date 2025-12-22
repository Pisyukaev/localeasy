import { Command } from 'commander';
import path from 'path';
import { startServer } from '@localeasy/dashboard/src/server';

export const uiCommand = new Command('ui')
  .description('Start the Localeasy dashboard server')
  .option(
    '-p, --port <port>',
    'Port to run the server on',
    '3001'
  )
  .option(
    '--host <host>',
    'Host to bind the server to',
    'localhost'
  )
  .option(
    '-d, --directory <path>',
    'Directory containing locale files',
    './locales'
  )
  .action(async (options) => {
    const { port, host, directory } = options;

    const portNumber = parseInt(port, 10);
    if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
      console.error('❌ Invalid port number. Port must be between 1 and 65535');
      process.exit(1);
    }

    const localesDir = path.resolve(process.cwd(), directory);

    console.log('🎨 Starting Localeasy Dashboard...');
    console.log(`📁 Locales directory: ${localesDir}`);
    console.log(`🌐 Server will be available at http://${host}:${portNumber}`);

    try {
      startServer({
        port: portNumber,
        host,
        directory: localesDir,
      });
    } catch (error) {
      console.error('❌ Failed to start server:', (error as Error).message);
      process.exit(1);
    }
  });
