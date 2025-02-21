import { logger } from '@/shared/lib/logger';
import { Button } from '@/components/ui/button';

export const LoggingExample = () => {
  // Example function demonstrating different log levels
  const handleButtonClick = () => {
    try {
      // Info level logging
      logger.info('User clicked example button', {
        timestamp: new Date().toISOString(),
        component: 'LoggingExample',
        action: 'buttonClick'
      });

      // Debug level logging
      logger.debug('Processing button click', {
        component: 'LoggingExample',
        details: 'Additional debug information'
      });

      // Simulate an error
      throw new Error('Example error');
    } catch (error) {
      // Error level logging
      logger.error('Error handling button click', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        component: 'LoggingExample'
      });

      // Warning level logging
      logger.warn('Operation failed but recovered', {
        component: 'LoggingExample',
        action: 'buttonClick',
        status: 'recovered'
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Logging Example Component</h2>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Click the button below to trigger different types of logs
        </p>
        
        <Button 
          onClick={handleButtonClick}
          variant="default"
        >
          Test Logging
        </Button>
      </div>

      <div className="text-sm text-gray-500 space-y-1">
        <p>This will demonstrate:</p>
        <ul className="list-disc list-inside">
          <li>Info level logging</li>
          <li>Debug level logging</li>
          <li>Error level logging</li>
          <li>Warning level logging</li>
        </ul>
      </div>
    </div>
  );
};