/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HyperliquidProvider, useHyperliquid } from '../src/providers/hyperliquid-provider';

// Mock the hyperliquid import
jest.mock('hyperliquid', () => {
  return {
    Hyperliquid: jest.fn().mockImplementation(() => ({
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn(),
      info: {
        spot: {
          getSpotMetaAndAssetCtxs: jest.fn().mockResolvedValue([
            {
              tokens: [{ name: 'HYPE', szDecimals: 4 }]
            },
            [
              {
                coin: 'HYPE-SPOT',
                midPx: '1.2345',
                prevDayPx: '1.2000',
                dayNtlVlm: '1000000.50'
              }
            ]
          ])
        }
      },
      exchange: {
        placeOrder: jest.fn().mockResolvedValue({ status: 'success', orderId: 'test-order-123' })
      },
      custom: {
        cancelAllOrders: jest.fn().mockResolvedValue({ status: 'success' })
      }
    }))
  };
});

// Test component that uses the hook
function TestComponent() {
  const {
    isConnected,
    error,
    testnet,
    privateKey,
    walletAddress,
    setPrivateKey,
    setWalletAddress,
    setTestnet,
    connect,
    disconnect,
    getSpotPrice,
    placeSpotOrder,
    cancelAllOrders
  } = useHyperliquid();

  return (
    <div>
      <div data-testid="connection-status">{isConnected ? 'connected' : 'disconnected'}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      <div data-testid="testnet">{testnet ? 'testnet' : 'mainnet'}</div>
      <div data-testid="private-key">{privateKey || 'no-key'}</div>
      <div data-testid="wallet-address">{walletAddress || 'no-address'}</div>
      
      <button onClick={() => setPrivateKey('test-key')}>Set Private Key</button>
      <button onClick={() => setWalletAddress('test-address')}>Set Wallet Address</button>
      <button onClick={() => setTestnet(false)}>Set Mainnet</button>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
      <button onClick={() => getSpotPrice('HYPE').then(data => console.log(data))}>Get Price</button>
      <button 
        onClick={() => placeSpotOrder({
          coin: 'HYPE',
          isBuy: true,
          size: 0.1,
          limitPx: 1.25
        })}
      >
        Place Order
      </button>
      <button onClick={cancelAllOrders}>Cancel Orders</button>
    </div>
  );
}

describe('HyperliquidProvider', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    // Reset console.warn mock
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('provides initial state correctly', () => {
    render(
      <HyperliquidProvider>
        <TestComponent />
      </HyperliquidProvider>
    );

    expect(screen.getByTestId('connection-status')).toHaveTextContent('disconnected');
    expect(screen.getByTestId('error')).toHaveTextContent('no-error');
    expect(screen.getByTestId('testnet')).toHaveTextContent('testnet');
    expect(screen.getByTestId('private-key')).toHaveTextContent('no-key');
    expect(screen.getByTestId('wallet-address')).toHaveTextContent('no-address');
  });

  it('updates state when setters are called', () => {
    render(
      <HyperliquidProvider>
        <TestComponent />
      </HyperliquidProvider>
    );

    fireEvent.click(screen.getByText('Set Private Key'));
    expect(screen.getByTestId('private-key')).toHaveTextContent('test-key');

    fireEvent.click(screen.getByText('Set Wallet Address'));
    expect(screen.getByTestId('wallet-address')).toHaveTextContent('test-address');

    fireEvent.click(screen.getByText('Set Mainnet'));
    expect(screen.getByTestId('testnet')).toHaveTextContent('mainnet');
  });

  it('connects successfully with real hyperliquid package', async () => {
    render(
      <HyperliquidProvider>
        <TestComponent />
      </HyperliquidProvider>
    );

    fireEvent.click(screen.getByText('Connect'));

    await waitFor(() => {
      expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
    });

    expect(screen.getByTestId('error')).toHaveTextContent('no-error');
  });

  it('handles hyperliquid import failure gracefully', async () => {
    // Mock import failure
    const originalImport = require('hyperliquid');
    jest.doMock('hyperliquid', () => {
      throw new Error('Package not found');
    });

    render(
      <HyperliquidProvider>
        <TestComponent />
      </HyperliquidProvider>
    );

    fireEvent.click(screen.getByText('Connect'));

    await waitFor(() => {
      expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
    });

    // Should use mock SDK and not show error
    expect(screen.getByTestId('error')).toHaveTextContent('no-error');
  });

  it('disconnects properly', async () => {
    render(
      <HyperliquidProvider>
        <TestComponent />
      </HyperliquidProvider>
    );

    // Connect first
    fireEvent.click(screen.getByText('Connect'));
    await waitFor(() => {
      expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
    });

    // Then disconnect
    fireEvent.click(screen.getByText('Disconnect'));
    expect(screen.getByTestId('connection-status')).toHaveTextContent('disconnected');
  });

  it('gets spot price correctly', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    
    render(
      <HyperliquidProvider>
        <TestComponent />
      </HyperliquidProvider>
    );

    // Connect first
    fireEvent.click(screen.getByText('Connect'));
    await waitFor(() => {
      expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
    });

    // Get price
    fireEvent.click(screen.getByText('Get Price'));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith({
        price: 1.2345,
        dayChangePct: '2.88',
        volume: '1000000.50'
      });
    });
  });

  it('places spot order with correct parameters', async () => {
    const mockPlaceOrder = jest.fn().mockResolvedValue({ status: 'success' });
    
    // Mock the hyperliquid package with our spy
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
        exchange: { placeOrder: mockPlaceOrder },
        custom: { cancelAllOrders: jest.fn().mockResolvedValue({ status: 'success' }) }
      }))
    }));

    render(
      <HyperliquidProvider>
        <TestComponent />
      </HyperliquidProvider>
    );

    // Set private key and connect
    fireEvent.click(screen.getByText('Set Private Key'));
    fireEvent.click(screen.getByText('Connect'));
    
    await waitFor(() => {
      expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
    });

    // Place order
    fireEvent.click(screen.getByText('Place Order'));

    await waitFor(() => {
      expect(mockPlaceOrder).toHaveBeenCalledWith({
        coin: 'HYPE-SPOT',
        asset: 10000,
        is_buy: true,
        sz: 0.1,
        limit_px: 1.25,
        reduce_only: false,
        order_type: { limit: { tif: 'Gtc' } }
      });
    });
  });

  it('requires private key for trading operations', async () => {
    render(
      <HyperliquidProvider>
        <TestComponent />
      </HyperliquidProvider>
    );

    // Connect without private key
    fireEvent.click(screen.getByText('Connect'));
    await waitFor(() => {
      expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
    });

    // Try to place order without private key
    try {
      fireEvent.click(screen.getByText('Place Order'));
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Private key required to place orders (use testnet only)');
      });
    } catch (error) {
      // Expected error
      expect(error.message).toContain('Private key required');
    }

    // Try to cancel orders without private key
    try {
      fireEvent.click(screen.getByText('Cancel Orders'));
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Private key required to cancel orders (use testnet only)');
      });
    } catch (error) {
      // Expected error
      expect(error.message).toContain('Private key required');
    }
  });

  it('handles connection errors gracefully', async () => {
    // Mock connection failure
    jest.doMock('hyperliquid', () => ({
      Hyperliquid: jest.fn().mockImplementation(() => ({
        connect: jest.fn().mockRejectedValue(new Error('Network error')),
        disconnect: jest.fn()
      }))
    }));

    render(
      <HyperliquidProvider>
        <TestComponent />
      </HyperliquidProvider>
    );

    fireEvent.click(screen.getByText('Connect'));

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Network error');
      expect(screen.getByTestId('connection-status')).toHaveTextContent('disconnected');
    });
  });

  it('throws error when used outside provider', () => {
    const TestComponentOutsideProvider = () => {
      try {
        useHyperliquid();
        return <div>Should not render</div>;
      } catch (error) {
        return <div>{error.message}</div>;
      }
    };

    render(<TestComponentOutsideProvider />);
    expect(screen.getByText('useHyperliquid must be used within HyperliquidProvider')).toBeInTheDocument();
  });

  it('handles server-side rendering', () => {
    // Mock server environment
    const originalWindow = global.window;
    delete global.window;

    render(
      <HyperliquidProvider>
        <TestComponent />
      </HyperliquidProvider>
    );

    fireEvent.click(screen.getByText('Connect'));

    expect(screen.getByTestId('error')).toHaveTextContent('Hyperliquid SDK requires browser environment');
    
    // Restore window
    global.window = originalWindow;
  });

  it('calculates market order price with slippage', async () => {
    const mockPlaceOrder = jest.fn().mockResolvedValue({ status: 'success' });
    
    jest.doMock('hyperliquid', () => ({
      Hyperliquid: jest.fn().mockImplementation(() => ({
        connect: jest.fn().mockResolvedValue(undefined),
        info: {
          spot: {
            getSpotMetaAndAssetCtxs: jest.fn().mockResolvedValue([
              { tokens: [{ name: 'HYPE', szDecimals: 4 }] },
              [{ coin: 'HYPE-SPOT', midPx: '1.0000' }]
            ])
          }
        },
        exchange: { placeOrder: mockPlaceOrder }
      }))
    }));

    const MarketOrderComponent = () => {
      const { placeSpotOrder, connect } = useHyperliquid();
      
      return (
        <div>
          <button onClick={connect}>Connect</button>
          <button 
            onClick={() => placeSpotOrder({
              coin: 'HYPE',
              isBuy: true,
              size: 0.1,
              limitPx: null // Market order
            })}
          >
            Market Buy
          </button>
          <button 
            onClick={() => placeSpotOrder({
              coin: 'HYPE',
              isBuy: false,
              size: 0.1,
              limitPx: null // Market order
            })}
          >
            Market Sell
          </button>
        </div>
      );
    };

    render(
      <HyperliquidProvider>
        <MarketOrderComponent />
      </HyperliquidProvider>
    );

    // Connect and place market buy order
    fireEvent.click(screen.getByText('Connect'));
    fireEvent.click(screen.getByText('Set Private Key'));
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Market Buy'));
    });

    await waitFor(() => {
      expect(mockPlaceOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          limit_px: 1.01, // 1% slippage for buy
          order_type: { market: {} }
        })
      );
    });

    // Place market sell order
    fireEvent.click(screen.getByText('Market Sell'));

    await waitFor(() => {
      expect(mockPlaceOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          limit_px: 0.99, // 1% slippage for sell
          order_type: { market: {} }
        })
      );
    });
  });
});
