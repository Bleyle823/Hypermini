"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { config } from "@/lib/config";

export default function ConfigurationChecker() {
  const [isChecking, setIsChecking] = useState(false);
  const [checkResults, setCheckResults] = useState<{
    [key: string]: { status: 'success' | 'error' | 'warning'; message: string };
  }>({});

  const checkConfiguration = async () => {
    setIsChecking(true);
    const results: { [key: string]: { status: 'success' | 'error' | 'warning'; message: string } } = {};

    try {
      // Check environment variables
      if (!process.env.NEXT_PUBLIC_BUILDER_ADDRESS || process.env.NEXT_PUBLIC_BUILDER_ADDRESS === '0x0000000000000000000000000000000000000000') {
        results.builderAddress = {
          status: 'error',
          message: 'Builder address not configured'
        };
      } else {
        results.builderAddress = {
          status: 'success',
          message: 'Builder address configured'
        };
      }

      if (!process.env.NEXT_PUBLIC_RPC_URL) {
        results.rpcUrl = {
          status: 'error',
          message: 'RPC URL not configured'
        };
      } else {
        results.rpcUrl = {
          status: 'success',
          message: 'RPC URL configured'
        };
      }

      if (!process.env.NEXT_PUBLIC_BUILDER_FEE || process.env.NEXT_PUBLIC_BUILDER_FEE === '0') {
        results.builderFee = {
          status: 'warning',
          message: 'Builder fee not configured'
        };
      } else {
        results.builderFee = {
          status: 'success',
          message: `Builder fee: ${process.env.NEXT_PUBLIC_BUILDER_FEE}`
        };
      }

      // Check API endpoints
      try {
        const response = await fetch(`${config.env === 'production' ? 'https://api.hyperliquid.xyz' : 'https://api.hyperliquid-testnet.xyz'}/info`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'spotMeta' })
        });
        
        if (response.ok) {
          results.apiEndpoint = {
            status: 'success',
            message: 'API endpoint accessible'
          };
        } else {
          results.apiEndpoint = {
            status: 'error',
            message: `API endpoint error: ${response.status}`
          };
        }
      } catch (error) {
        results.apiEndpoint = {
          status: 'error',
          message: `API endpoint unreachable: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
      }

      // Check environment mode
      results.environment = {
        status: config.env === 'production' ? 'success' : 'warning',
        message: `Environment: ${config.env}`
      };

    } catch (error) {
      results.general = {
        status: 'error',
        message: `Configuration check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }

    setCheckResults(results);
    setIsChecking(false);
  };

  const getStatusColor = (status: 'success' | 'error' | 'warning') => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Configuration Checker</CardTitle>
        <CardDescription>
          Verify your environment setup and identify configuration issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={checkConfiguration} 
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? "Checking..." : "Check Configuration"}
        </Button>

        {Object.keys(checkResults).length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Results:</h4>
            {Object.entries(checkResults).map(([key, result]) => (
              <div key={key} className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <Badge className={getStatusColor(result.status)}>
                  {result.message}
                </Badge>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>Make sure to set up your environment variables in a <code>.env.local</code> file:</p>
          <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
{`NEXT_PUBLIC_BUILDER_ADDRESS=your_builder_address
NEXT_PUBLIC_RPC_URL=your_rpc_url
NEXT_PUBLIC_BUILDER_FEE=10
NEXT_PUBLIC_NODE_ENV=development`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
