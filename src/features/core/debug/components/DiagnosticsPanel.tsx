'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertCircle,
  Clock,
  Database,
  HardDrive,
  LifeBuoy,
  Network,
  RefreshCw,
  X
} from 'lucide-react';

/**
 * Debug Diagnostics Panel
 * 
 * This component displays a floating panel with debugging information.
 * It helps troubleshoot common issues with:
 * - localStorage
 * - API requests
 * - Performance
 * - Premium status
 * 
 * The panel can be toggled with a button and includes emergency fixes.
 */
export const DiagnosticsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('localstorage');
  const [localStorageItems, setLocalStorageItems] = useState<{ key: string; size: number; value: string }[]>([]);
  const [apiCalls, setApiCalls] = useState<any[]>([]);
  const [memoryUsage, setMemoryUsage] = useState<{ used: number; total: number; limit: number }>({ 
    used: 0, 
    total: 0, 
    limit: 0
  });
  
  // Load localStorage items for inspection
  useEffect(() => {
    if (isOpen && activeTab === 'localstorage') {
      const items = [];
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i) || '';
          const value = localStorage.getItem(key) || '';
          items.push({
            key,
            size: (value.length * 2) / 1024, // Approximate KB size (2 bytes per char)
            value: value.length > 100 ? `${value.substring(0, 100)}...` : value
          });
        }
        setLocalStorageItems(items.sort((a, b) => b.size - a.size)); // Sort by size desc
      } catch (e) {
        console.error('Error accessing localStorage:', e);
      }
    }
  }, [isOpen, activeTab]);
  
  // Monitor API calls if we can intercept them
  useEffect(() => {
    if (isOpen && activeTab === 'api') {
      const originalFetch = window.fetch;
      const calls: any[] = [];
      
      // Override fetch to monitor calls
      window.fetch = async function(input, init) {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.href : String(input);
        const startTime = performance.now();
        
        try {
          const response = await originalFetch(input, init);
          const endTime = performance.now();
          calls.push({
            url,
            method: init?.method || 'GET',
            status: response.status,
            time: Math.round(endTime - startTime),
            timestamp: new Date().toISOString()
          });
          setApiCalls([...calls]);
          return response;
        } catch (error) {
          const endTime = performance.now();
          calls.push({
            url,
            method: init?.method || 'GET',
            error: error instanceof Error ? error.message : 'Unknown error',
            time: Math.round(endTime - startTime),
            timestamp: new Date().toISOString()
          });
          setApiCalls([...calls]);
          throw error;
        }
      };
      
      return () => {
        // Restore original fetch
        window.fetch = originalFetch;
      };
    }
  }, [isOpen, activeTab]);
  
  // Monitor memory usage
  useEffect(() => {
    if (isOpen && activeTab === 'performance') {
      const checkMemory = () => {
        if (window.performance && (performance as any).memory) {
          const memInfo = (performance as any).memory;
          setMemoryUsage({
            used: Math.round(memInfo.usedJSHeapSize / (1024 * 1024)),
            total: Math.round(memInfo.totalJSHeapSize / (1024 * 1024)),
            limit: Math.round(memInfo.jsHeapSizeLimit / (1024 * 1024))
          });
        }
      };
      
      checkMemory();
      const interval = setInterval(checkMemory, 2000);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [isOpen, activeTab]);
  
  // Emergency fixes
  const clearLocalStorage = (key?: string) => {
    try {
      if (key) {
        localStorage.removeItem(key);
      } else {
        localStorage.clear();
      }
      setLocalStorageItems([]);
      setTimeout(() => {
        // Refresh the storage items list
        if (isOpen && activeTab === 'localstorage') {
          const items = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i) || '';
            const value = localStorage.getItem(key) || '';
            items.push({
              key,
              size: (value.length * 2) / 1024, // Approximate KB size
              value: value.length > 100 ? `${value.substring(0, 100)}...` : value
            });
          }
          setLocalStorageItems(items.sort((a, b) => b.size - a.size));
        }
      }, 100);
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };
  
  const resetPremiumStatus = () => {
    try {
      localStorage.removeItem('pharmacyhub_premium_status');
      localStorage.removeItem('manual-payment-store');
      alert('Premium status has been reset. Please refresh the page.');
    } catch (e) {
      console.error('Error resetting premium status:', e);
    }
  };
  
  const fixUIFreezing = () => {
    try {
      // Clear problematic localStorage items
      const problemItems = [
        'manual-payment-store',
        'zustand-payment-store',
        'pharmacyhub_premium_status',
        'premium-access-cache'
      ];
      
      problemItems.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.error(`Error removing ${key}:`, e);
        }
      });
      
      // Clear any pending timeouts
      if ((window as any).__MANUAL_PAYMENT_STORAGE_TIMEOUT) {
        window.clearTimeout((window as any).__MANUAL_PAYMENT_STORAGE_TIMEOUT);
        (window as any).__MANUAL_PAYMENT_STORAGE_TIMEOUT = null;
      }
      
      // Set a clean default state for manual payment store
      localStorage.setItem('manual-payment-store', JSON.stringify({
        state: {
          userRequests: [],
          examAccessMap: {},
          pendingRequestMap: {},
          lastFetchedUserRequests: 0,
          lastFetchedExamAccess: {},
          lastFetchedPendingRequest: {}
        },
        version: 0
      }));
      
      alert('UI freezing issues should be fixed. Please refresh the page.');
    } catch (e) {
      console.error('Error fixing UI freezing:', e);
    }
  };
  
  if (!isOpen) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 rounded-full p-0 bg-white shadow-md"
          onClick={() => setIsOpen(true)}
        >
          <LifeBuoy className="h-4 w-4" />
        </Button>
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-5 right-5 w-96 z-50">
      <Card className="shadow-lg border-gray-300">
        <CardHeader className="bg-gray-50 p-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
            PharmacyHub Diagnostics
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 bg-gray-100">
              <TabsTrigger value="localstorage">
                <Database className="h-3 w-3 mr-1" />
                <span className="text-xs">Storage</span>
              </TabsTrigger>
              <TabsTrigger value="api">
                <Network className="h-3 w-3 mr-1" />
                <span className="text-xs">API</span>
              </TabsTrigger>
              <TabsTrigger value="performance">
                <Clock className="h-3 w-3 mr-1" />
                <span className="text-xs">Perf</span>
              </TabsTrigger>
              <TabsTrigger value="fixes">
                <LifeBuoy className="h-3 w-3 mr-1" />
                <span className="text-xs">Fixes</span>
              </TabsTrigger>
            </TabsList>
            
            {/* LocalStorage Tab */}
            <TabsContent value="localstorage" className="h-72 overflow-auto">
              <div className="p-2 flex justify-between">
                <Badge variant="secondary" className="h-5 text-xs font-normal">
                  {localStorageItems.length} items • {Math.round(localStorageItems.reduce((acc, item) => acc + item.size, 0))} KB
                </Badge>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-6 text-xs py-0 px-2"
                  onClick={() => clearLocalStorage()}
                >
                  Clear All
                </Button>
              </div>
              
              {localStorageItems.length > 0 ? (
                <div className="space-y-1 p-2">
                  {localStorageItems.map((item, index) => (
                    <div 
                      key={index} 
                      className="text-xs border rounded-md p-2 bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium truncate max-w-[200px]">{item.key}</span>
                        <Badge variant="outline" className="h-5 text-[10px] font-normal">
                          {item.size.toFixed(1)} KB
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-5 w-5 p-0 ml-2"
                          onClick={() => clearLocalStorage(item.key)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="truncate text-gray-500 text-[10px] mt-1">{item.value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 text-xs">
                  No localStorage items found
                </div>
              )}
            </TabsContent>
            
            {/* API Tab */}
            <TabsContent value="api" className="h-72 overflow-auto">
              <div className="p-2 flex justify-between">
                <Badge variant="secondary" className="h-5 text-xs font-normal">
                  {apiCalls.length} calls monitored
                </Badge>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-6 text-xs py-0 px-2"
                  onClick={() => setApiCalls([])}
                >
                  Clear
                </Button>
              </div>
              
              {apiCalls.length > 0 ? (
                <div className="space-y-1 p-2">
                  {apiCalls.map((call, index) => (
                    <div 
                      key={index} 
                      className={`text-xs border rounded-md p-2 ${
                        call.error ? 'bg-red-50' : 'bg-gray-50'
                      } hover:bg-gray-100`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{call.method}</span>
                        {call.error ? (
                          <Badge variant="destructive" className="h-5 text-[10px] font-normal">
                            Error
                          </Badge>
                        ) : (
                          <Badge 
                            variant={call.status >= 400 ? 'destructive' : 'outline'} 
                            className="h-5 text-[10px] font-normal"
                          >
                            {call.status}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="h-5 text-[10px] font-normal ml-1">
                          {call.time}ms
                        </Badge>
                      </div>
                      <div className="truncate text-gray-500 text-[10px] mt-1">
                        {call.url.includes('?') 
                          ? call.url.split('?')[0] 
                          : call.url}
                      </div>
                      {call.error && (
                        <div className="text-red-500 text-[10px] mt-1">{call.error}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 text-xs">
                  No API calls monitored yet
                </div>
              )}
            </TabsContent>
            
            {/* Performance Tab */}
            <TabsContent value="performance" className="h-72 overflow-auto">
              <div className="p-4 space-y-4">
                <div className="border rounded-md p-3 bg-gray-50">
                  <div className="text-xs font-medium mb-2">JS Heap Usage</div>
                  {(performance as any).memory ? (
                    <>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            memoryUsage.used / memoryUsage.limit > 0.8 
                              ? 'bg-red-500' 
                              : memoryUsage.used / memoryUsage.limit > 0.6 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${(memoryUsage.used / memoryUsage.limit) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                        <span>{memoryUsage.used} MB used</span>
                        <span>{memoryUsage.limit} MB limit</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-gray-500">
                      Memory info not available in this browser
                    </div>
                  )}
                </div>
                
                <div className="border rounded-md p-3 bg-gray-50">
                  <div className="text-xs font-medium mb-2">Storage Usage</div>
                  <div className="text-xs">
                    {(() => {
                      try {
                        const total = 
                          Object.keys(localStorage).reduce(
                            (acc, key) => acc + (localStorage.getItem(key)?.length || 0) * 2, 0
                          ) / (1024 * 1024);
                        
                        return (
                          <>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  total > 4 
                                    ? 'bg-red-500' 
                                    : total > 3 
                                      ? 'bg-yellow-500' 
                                      : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(100, (total / 5) * 100)}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                              <span>{total.toFixed(2)} MB used</span>
                              <span>~5 MB limit</span>
                            </div>
                          </>
                        );
                      } catch (e) {
                        return (
                          <div className="text-xs text-gray-500">
                            Storage info not available
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Fixes Tab */}
            <TabsContent value="fixes" className="h-72 overflow-auto">
              <div className="p-4 space-y-3">
                <div className="border rounded-md p-3 bg-gray-50">
                  <div className="text-xs font-medium mb-2">UI Freezing Issues</div>
                  <div className="text-xs text-gray-600 mb-2">
                    Fixes problems with UI freezing due to localStorage operations
                  </div>
                  <Button 
                    size="sm"
                    variant="default"
                    className="w-full h-7 text-xs"
                    onClick={fixUIFreezing}
                  >
                    <HardDrive className="h-3 w-3 mr-1" />
                    Fix UI Freezing
                  </Button>
                </div>
                
                <div className="border rounded-md p-3 bg-gray-50">
                  <div className="text-xs font-medium mb-2">Premium Status Reset</div>
                  <div className="text-xs text-gray-600 mb-2">
                    Resets premium status data if premium features aren't working
                  </div>
                  <Button 
                    size="sm"
                    variant="default"
                    className="w-full h-7 text-xs"
                    onClick={resetPremiumStatus}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Reset Premium Status
                  </Button>
                </div>
                
                <div className="border rounded-md p-3 bg-gray-50">
                  <div className="text-xs font-medium mb-2">Emergency Reset</div>
                  <div className="text-xs text-gray-600 mb-2">
                    Complete reset of all app data (use as last resort)
                  </div>
                  <Button 
                    size="sm"
                    variant="destructive"
                    className="w-full h-7 text-xs"
                    onClick={() => {
                      if (confirm('This will clear ALL app data. Continue?')) {
                        clearLocalStorage();
                        alert('All app data has been reset. Please refresh the page.');
                      }
                    }}
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Emergency Reset
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosticsPanel;