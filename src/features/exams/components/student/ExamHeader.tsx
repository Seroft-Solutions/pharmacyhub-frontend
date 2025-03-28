import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSignIcon } from 'lucide-react';
import { NetworkStatusIndicator } from '../common/NetworkStatusIndicator';
import { useMobileStore, selectIsMobile } from '../../../core/app-mobile-handler';

interface ExamHeaderProps {
  title: string;
  description?: string;
  isPremium?: boolean;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({ 
  title, 
  description, 
  isPremium = false 
}) => {
  const isMobile = useMobileStore(selectIsMobile);

  return (
    <Card className="shadow-md border border-gray-100 overflow-hidden">
      <CardHeader className={`${isMobile ? 'py-3 px-3' : 'pb-3'} border-b bg-gradient-to-r from-blue-50 to-white`}>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-blue-700`}>
              {title}
              {isPremium && (
                <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-amber-300 to-amber-500 text-white">
                  <DollarSignIcon className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </CardTitle>
            {description && (
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 mt-1`}>{description}</p>
            )}
          </div>
          <NetworkStatusIndicator />
        </div>
      </CardHeader>
    </Card>
  );
};
