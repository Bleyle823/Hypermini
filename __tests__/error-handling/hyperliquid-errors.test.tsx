/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HyperliquidProvider, useHyperliquid } from '../../src/providers/hyperliquid-provider';
import { resetAllMocks } from '../utils/test-helpers';

// Error testing component
function ErrorTestComponent() {
  const {
    isConnected,
    error,
    connect,
    getSpotPrice,
    placeSpotOrder,
    cancelAllOrders,
    setPrivateKey
  } = useHyperliquid();

  const [result, setResult] = React.useState<string>('');

  const testGetPrice = async (symbol: string) => {
    try {
      const data = await getSpotPrice(symbol);
      setResult(`Price: ${data.price}`);
    } catch (err: unknown) {
      setResult(`Error: ${(err as Error).message}`);
    }
  };

  const testPlaceOrder = async () => {
    try {
      const result = await placeSpotOrder({
        coin: 'HYPE',
        isBuy: true,
        size: 0.1,
        limitPx: 1.25
      });
      setResult(`Order: ${result.status}`);
    } catch (err: unknown) {
      setResult(`Error: ${(err as Error).message}`);
    }
  };

  const testCancelOrders = async () => {
    try {
      await cancelAllOrders();
      setResult('Cancel: success');
    } catch (err: unknown) {
      setResult(`Error: ${(err as Error).message}`);
    }
  };

  return (
    <div>
      <div data-testid="connection-status">{isConnected ? 'connected' : 'disconnected'}</div>
      <div data-testid="error">{error || ''}</div>
      <div data-testid="result">{result}</div>
      
      <button onClick={() => setPrivateKey('test-key')}>Set Private Key</button>
      <button onClick={connect}>Connect</button>
      <button onClick={() => testGetPrice('HYPE')}>Get Valid Price</button>
      <button onClick={() => testGetPrice('INVALID')}>Get Invalid Price</button>
      <button onClick={testPlaceOrder}>Place Order</button>
      <button onClick={testCancelOrders}>Cancel Orders</button>
    </div>
  );
}

describe('Hyperliquid Error Handling', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('Connection Errors', () => {
    it('handles SDK import failure gracefully', async () => {
      // Mock import failure
      jest.doMock('hyperliquid', () => {
        throw new Error('Module not found');
      });

      render(
        <HyperliquidProvider>
          <ErrorTestComponent />
        </HyperliquidProvider>
      );

      fireEvent.click(screen.getByText('Connect'));

      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
        expect(screen.getByTestId('error')).toHaveTextContent('');
      });

      // Should still work with mock SDK
      fireEvent.click(screen.getByText('Get Valid Price'));
      await waitFor(() => {
        expect(screen.getByTestId('result')).toHaveTextContent('Price: 1.2345');
      });
    });

    it('handles SDK connection failure', async () => {
      jest.doMock('hyperliquid', () => ({
        Hyperliquid: jest.fn().mockImplementation(() => ({
          connect: jest.fn().mockRejectedValue(new Error('Network timeout')),
          disconnect: jest.fn()
        }))
      }));

      render(
        <HyperliquidProvider>
          <ErrorTestComponent />
        </HyperliquidProvider>
      );

      fireEvent.click(screen.getByText('Connect'));

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Network timeout');
        expect(screen.getByTestId('connection-status')).toHaveTextContent('disconnected');
      });
    });

    it('handles server environment error', async () => {
      // Mock server environment
      const originalWindow = global.window;
      delete (global as any).window;

      render(
        <HyperliquidProvider>
          <ErrorTestComponent />
        </HyperliquidProvider>
      );

      fireEvent.click(screen.getByText('Connect'));

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Hyperliquid SDK requires browser environment');
      });

      // Restore window
      global.window = originalWindow;
    });
  });

  describe('API Call Errors', () => {
    beforeEach(async () => {
      // Set up connected state
      jest.doMock('hyperliquid', () => ({
        Hyperliquid: jest.fn().mockImplementation(() => ({
          connect: jest.fn().mockResolvedValue(undefined),
          disconnect: jest.fn(),
          info: {
            spot: {
              getSpotMetaAndAssetCtxs: jest.fn().mockImplementation((symbol) => {
                if (symbol === 'INVALID') {
                  return Promise.resolve([{ tokens: [] }, []]);
                }
                return Promise.resolve([
                  { tokens: [{ name: 'HYPE', szDecimals: 4 }] },
                  [{ coin: 'HYPE-SPOT', midPx: '1.2345', prevDayPx: '1.2000', dayNtlVlm: '1000000.50' }]
                ]);
              })
            }
          },
          exchange: {
            placeOrder: jest.fn().mockRejectedValue(new Error('Insufficient balance'))
          },
          custom: {
            cancelAllOrders: jest.fn().mockRejectedValue(new Error('No orders to cancel'))
          }
        }))
      }));
    });

    it('handles invalid symbol error', async () => {
      render(
        <HyperliquidProvider>
          <ErrorTestComponent />
        </HyperliquidProvider>
      );

      fireEvent.click(screen.getByText('Connect'));
      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
      });

      fireEvent.click(screen.getByText('Get Invalid Price'));
      await waitFor(() => {
        expect(screen.getByTestId('result')).toHaveTextContent('Error: Could not find market for INVALID');
      });
    });

    it('handles order placement errors', async () => {
      render(
        <HyperliquidProvider>
          <ErrorTestComponent />
        </HyperliquidProvider>
      );

      fireEvent.click(screen.getByText('Set Private Key'));
      fireEvent.click(screen.getByText('Connect'));
      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
      });

      fireEvent.click(screen.getByText('Place Order'));
      await waitFor(() => {
        expect(screen.getByTestId('result')).toHaveTextContent('Error: Insufficient balance');
      });
    });

    it('handles cancel orders errors', async () => {
      render(
        <HyperliquidProvider>
          <ErrorTestComponent />
        </HyperliquidProvider>
      );

      fireEvent.click(screen.getByText('Set Private Key'));
      fireEvent.click(screen.getByText('Connect'));
      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
      });

      fireEvent.click(screen.getByText('Cancel Orders'));
      await waitFor(() => {
        expect(screen.getByTestId('result')).toHaveTextContent('Error: No orders to cancel');
      });
    });
  });

  describe('Authentication Errors', () => {
    it('prevents trading without private key', async () => {
      jest.doMock('hyperliquid', () => ({
        Hyperliquid: jest.fn().mockImplementation(() => ({
          connect: jest.fn().mockResolvedValue(undefined),
          disconnect: jest.fn(),
          info: {
            spot: {
              getSpotMetaAndAssetCtxs: jest.fn().mockResolvedValue([
                { tokens: [{ name: 'HYPE', szDecimals: 4 }] },
                [{ coin: 'HYPE-SPOT', midPx: '1.2345', prevDayPx: '1.2000', dayNtlVlm: '1000000.50' }]
              ])
            }
          },
          exchange: { placeOrder: jest.fn() },
          custom: { cancelAllOrders: jest.fn() }
        }))
      }));

      render(
        <HyperliquidProvider>
          <ErrorTestComponent />
        </HyperliquidProvider>
      );

      fireEvent.click(screen.getByText('Connect'));
      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
      });

      // Try to place order without private key
      fireEvent.click(screen.getByText('Place Order'));
      await waitFor(() => {
        expect(screen.getByTestId('result')).toHaveTextContent('Error: Private key required to place orders (use testnet only)');
      });

      // Try to cancel orders without private key
      fireEvent.click(screen.getByText('Cancel Orders'));
      await waitFor(() => {
        expect(screen.getByTestId('result')).toHaveTextContent('Error: Private key required to cancel orders (use testnet only)');
      });
    });
  });

  describe('Data Validation Errors', () => {
    beforeEach(() => {
      jest.doMock('hyperliquid', () => ({
        Hyperliquid: jest.fn().mockImplementation(() => ({
          connect: jest.fn().mockResolvedValue(undefined),
          disconnect: jest.fn(),
          info: {
            spot: {
              getSpotMetaAndAssetCtxs: jest.fn().mockResolvedValue([
                { tokens: [{ name: 'HYPE', szDecimals: 4 }] },
                [{ coin: 'HYPE-SPOT', midPx: null, prevDayPx: '1.2000', dayNtlVlm: '1000000.50' }]
              ])
            }
          }
        }))
      }));
    });

    it('handles missing price data', async () => {
      render(
        <HyperliquidProvider>
          <ErrorTestComponent />
        </HyperliquidProvider>
      );

      fireEvent.click(screen.getByText('Connect'));
      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
      });

      fireEvent.click(screen.getByText('Get Valid Price'));
      await waitFor(() => {
        expect(screen.getByTestId('result')).toHaveTextContent('Error: Could not get market price for HYPE');
      });
    });
  });

  describe('Network Errors', () => {
    it('handles network disconnection during operation', async () => {
      const mockGetSpotPrice = jest.fn()
        .mockResolvedValueOnce([
          { tokens: [{ name: 'HYPE', szDecimals: 4 }] },
          [{ coin: 'HYPE-SPOT', midPx: '1.2345', prevDayPx: '1.2000', dayNtlVlm: '1000000.50' }]
        ])
        .mockRejectedValueOnce(new Error('Network error'));

      jest.doMock('hyperliquid', () => ({
        Hyperliquid: jest.fn().mockImplementation(() => ({
          connect: jest.fn().mockResolvedValue(undefined),
          disconnect: jest.fn(),
          info: {
            spot: {
              getSpotMetaAndAssetCtxs: mockGetSpotPrice
            }
          }
        }))
      }));

      render(
        <HyperliquidProvider>
          <ErrorTestComponent />
        </HyperliquidProvider>
      );

      fireEvent.click(screen.getByText('Connect'));
      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
      });

      // First call succeeds
      fireEvent.click(screen.getByText('Get Valid Price'));
      await waitFor(() => {
        expect(screen.getByTestId('result')).toHaveTextContent('Price: 1.2345');
      });

      // Second call fails due to network error
      fireEvent.click(screen.getByText('Get Valid Price'));
      await waitFor(() => {
        expect(screen.getByTestId('result')).toHaveTextContent('Error: Network error');
      });
    });
  });

  describe('Cleanup and Recovery', () => {
    it('recovers from errors and allows retry', async () => {
      const mockConnect = jest.fn()
        .mockRejectedValueOnce(new Error('First connection failed'))
        .mockResolvedValueOnce(undefined);

      jest.doMock('hyperliquid', () => ({
        Hyperliquid: jest.fn().mockImplementation(() => ({
          connect: mockConnect,
          disconnect: jest.fn(),
          info: {
            spot: {
              getSpotMetaAndAssetCtxs: jest.fn().mockResolvedValue([
                { tokens: [{ name: 'HYPE', szDecimals: 4 }] },
                [{ coin: 'HYPE-SPOT', midPx: '1.2345', prevDayPx: '1.2000', dayNtlVlm: '1000000.50' }]
              ])
            }
          }
        }))
      }));

      render(
        <HyperliquidProvider>
          <ErrorTestComponent />
        </HyperliquidProvider>
      );

      // First connection attempt fails
      fireEvent.click(screen.getByText('Connect'));
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('First connection failed');
        expect(screen.getByTestId('connection-status')).toHaveTextContent('disconnected');
      });

      // Second connection attempt succeeds
      fireEvent.click(screen.getByText('Connect'));
      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
        expect(screen.getByTestId('error')).toHaveTextContent('');
      });

      // Can now perform operations successfully
      fireEvent.click(screen.getByText('Get Valid Price'));
      await waitFor(() => {
        expect(screen.getByTestId('result')).toHaveTextContent('Price: 1.2345');
      });
    });
  });
});
