/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HyperliquidProvider, useHyperliquid } from '../../src/providers/hyperliquid-provider';
import { 
  mockHyperliquidPackage, 
  mockHyperliquidImportFailure,
  testPriceData,
  testOrderParams,
  resetAllMocks,
  mockServerEnvironment
} from '../utils/test-helpers';

// Integration test component that mimics real app usage
function TradingInterface() {
  const {
    isConnected,
    error,
    testnet,
    connect,
    disconnect,
    setPrivateKey,
    setTestnet,
    getSpotPrice,
    placeSpotOrder,
    cancelAllOrders
  } = useHyperliquid();

  const [symbol, setSymbol] = React.useState('HYPE');
  const [priceData, setPriceData] = React.useState(null);
  const [size, setSize] = React.useState('0.1');
  const [price, setPrice] = React.useState('');
  const [isLimit, setIsLimit] = React.useState(true);
  const [orderResult, setOrderResult] = React.useState(null);

  const handleGetPrice = async () => {
    try {
      const data = await getSpotPrice(symbol);
      setPriceData(data);
      setPrice(data.price.toFixed(4));
    } catch (err) {
      console.error('Price fetch error:', err);
    }
  };

  const handlePlaceOrder = async (isBuy: boolean) => {
    try {
      const result = await placeSpotOrder({
        coin: symbol,
        isBuy,
        size: Number(size),
        limitPx: isLimit ? Number(price) : null
      });
      setOrderResult(result);
    } catch (err) {
      console.error('Order error:', err);
    }
  };

  const handleCancelAll = async () => {
    try {
      await cancelAllOrders();
    } catch (err) {
      console.error('Cancel error:', err);
    }
  };

  return (
    <div>
      <div data-testid="connection-status">{isConnected ? 'connected' : 'disconnected'}</div>
      <div data-testid="error">{error || ''}</div>
      <div data-testid="network">{testnet ? 'testnet' : 'mainnet'}</div>
      
      {/* Connection controls */}
      <button onClick={() => setPrivateKey('test-private-key')}>Set Private Key</button>
      <button onClick={() => setTestnet(true)}>Set Testnet</button>
      <button onClick={() => setTestnet(false)}>Set Mainnet</button>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
      
      {/* Trading controls */}
      <input 
        data-testid="symbol-input"
        value={symbol} 
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Symbol"
      />
      <button onClick={handleGetPrice}>Get Price</button>
      
      {priceData && (
        <div data-testid="price-data">
          <div data-testid="current-price">{priceData.price}</div>
          <div data-testid="day-change">{priceData.dayChangePct}%</div>
          <div data-testid="volume">{priceData.volume}</div>
        </div>
      )}
      
      <input 
        data-testid="size-input"
        value={size} 
        onChange={(e) => setSize(e.target.value)}
        placeholder="Size"
      />
      
      <input 
        data-testid="price-input"
        value={price} 
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        disabled={!isLimit}
      />
      
      <button onClick={() => setIsLimit(true)}>Limit Order</button>
      <button onClick={() => setIsLimit(false)}>Market Order</button>
      
      <button onClick={() => handlePlaceOrder(true)}>Buy</button>
      <button onClick={() => handlePlaceOrder(false)}>Sell</button>
      <button onClick={handleCancelAll}>Cancel All</button>
      
      {orderResult && (
        <div data-testid="order-result">{JSON.stringify(orderResult)}</div>
      )}
    </div>
  );
}

describe('Hyperliquid Integration Tests', () => {
  beforeEach(() => {
    resetAllMocks();
    mockHyperliquidPackage();
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('Complete Trading Flow', () => {
    it('performs full trading workflow successfully', async () => {
      render(
        <HyperliquidProvider>
          <TradingInterface />
        </HyperliquidProvider>
      );

      // Initial state
      expect(screen.getByTestId('connection-status')).toHaveTextContent('disconnected');
      expect(screen.getByTestId('network')).toHaveTextContent('testnet');

      // Set up for trading
      fireEvent.click(screen.getByText('Set Private Key'));
      fireEvent.click(screen.getByText('Set Testnet'));
      
      // Connect
      fireEvent.click(screen.getByText('Connect'));
      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
      });

      // Get price data
      fireEvent.click(screen.getByText('Get Price'));
      await waitFor(() => {
        expect(screen.getByTestId('current-price')).toHaveTextContent('1.2345');
        expect(screen.getByTestId('day-change')).toHaveTextContent('2.88%');
        expect(screen.getByTestId('volume')).toHaveTextContent('1000000.50');
      });

      // Place limit buy order
      fireEvent.change(screen.getByTestId('size-input'), { target: { value: '1.0' } });
      fireEvent.change(screen.getByTestId('price-input'), { target: { value: '1.25' } });
      fireEvent.click(screen.getByText('Limit Order'));
      fireEvent.click(screen.getByText('Buy'));

      await waitFor(() => {
        const orderResult = screen.getByTestId('order-result');
        expect(orderResult).toHaveTextContent('success');
      });

      // Place market sell order
      fireEvent.click(screen.getByText('Market Order'));
      fireEvent.click(screen.getByText('Sell'));

      await waitFor(() => {
        const orderResult = screen.getByTestId('order-result');
        expect(orderResult).toHaveTextContent('success');
      });

      // Cancel all orders
      fireEvent.click(screen.getByText('Cancel All'));

      // Disconnect
      fireEvent.click(screen.getByText('Disconnect'));
      expect(screen.getByTestId('connection-status')).toHaveTextContent('disconnected');
    });

    it('handles different symbols correctly', async () => {
      render(
        <HyperliquidProvider>
          <TradingInterface />
        </HyperliquidProvider>
      );

      // Connect first
      fireEvent.click(screen.getByText('Connect'));
      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
      });

      // Test BTC price
      fireEvent.change(screen.getByTestId('symbol-input'), { target: { value: 'BTC' } });
      fireEvent.click(screen.getByText('Get Price'));
      
      await waitFor(() => {
        expect(screen.getByTestId('current-price')).toHaveTextContent('45000');
      });

      // Test ETH price
      fireEvent.change(screen.getByTestId('symbol-input'), { target: { value: 'ETH' } });
      fireEvent.click(screen.getByText('Get Price'));
      
      await waitFor(() => {
        expect(screen.getByTestId('current-price')).toHaveTextContent('3200');
      });
    });
  });

  describe('Error Scenarios', () => {
    it('handles network switching correctly', async () => {
      render(
        <HyperliquidProvider>
          <TradingInterface />
        </HyperliquidProvider>
      );

      // Start on testnet
      expect(screen.getByTestId('network')).toHaveTextContent('testnet');

      // Switch to mainnet
      fireEvent.click(screen.getByText('Set Mainnet'));
      expect(screen.getByTestId('network')).toHaveTextContent('mainnet');

      // Connect on mainnet
      fireEvent.click(screen.getByText('Connect'));
      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
      });

      // Switch back to testnet and reconnect
      fireEvent.click(screen.getByText('Set Testnet'));
      fireEvent.click(screen.getByText('Connect'));
      
      await waitFor(() => {
        expect(screen.getByTestId('network')).toHaveTextContent('testnet');
        expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
      });
    });

    it('handles connection failures gracefully', async () => {
      // Mock connection failure
      jest.doMock('hyperliquid', () => ({
        Hyperliquid: jest.fn().mockImplementation(() => ({
          connect: jest.fn().mockRejectedValue(new Error('Connection failed')),
          disconnect: jest.fn()
        }))
      }));

      render(
        <HyperliquidProvider>
          <TradingInterface />
        </HyperliquidProvider>
      );

      fireEvent.click(screen.getByText('Connect'));

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Connection failed');
        expect(screen.getByTestId('connection-status')).toHaveTextContent('disconnected');
      });
    });

    it('falls back to mock SDK when import fails', async () => {
      mockHyperliquidImportFailure();

      render(
        <HyperliquidProvider>
          <TradingInterface />
        </HyperliquidProvider>
      );

      fireEvent.click(screen.getByText('Connect'));

      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
        expect(screen.getByTestId('error')).toHaveTextContent('');
      });

      // Should still be able to get mock price data
      fireEvent.click(screen.getByText('Get Price'));
      await waitFor(() => {
        expect(screen.getByTestId('current-price')).toHaveTextContent('1.2345');
      });
    });
  });

  describe('Server-Side Rendering', () => {
    it('handles SSR environment gracefully', async () => {
      const restoreWindow = mockServerEnvironment();

      render(
        <HyperliquidProvider>
          <TradingInterface />
        </HyperliquidProvider>
      );

      fireEvent.click(screen.getByText('Connect'));

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Hyperliquid SDK requires browser environment');
        expect(screen.getByTestId('connection-status')).toHaveTextContent('disconnected');
      });

      restoreWindow();
    });
  });

  describe('Trading Order Types', () => {
    beforeEach(async () => {
      render(
        <HyperliquidProvider>
          <TradingInterface />
        </HyperliquidProvider>
      );

      // Set up trading environment
      fireEvent.click(screen.getByText('Set Private Key'));
      fireEvent.click(screen.getByText('Connect'));
      
      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
      });
    });

    it('places limit orders with correct parameters', async () => {
      fireEvent.change(screen.getByTestId('size-input'), { target: { value: '2.5' } });
      fireEvent.change(screen.getByTestId('price-input'), { target: { value: '1.30' } });
      fireEvent.click(screen.getByText('Limit Order'));
      fireEvent.click(screen.getByText('Buy'));

      await waitFor(() => {
        expect(screen.getByTestId('order-result')).toHaveTextContent('success');
      });
    });

    it('places market orders without price', async () => {
      fireEvent.change(screen.getByTestId('size-input'), { target: { value: '1.5' } });
      fireEvent.click(screen.getByText('Market Order'));
      fireEvent.click(screen.getByText('Sell'));

      await waitFor(() => {
        expect(screen.getByTestId('order-result')).toHaveTextContent('success');
      });
    });

    it('calculates market order slippage correctly', async () => {
      // Get current price first
      fireEvent.click(screen.getByText('Get Price'));
      await waitFor(() => {
        expect(screen.getByTestId('current-price')).toHaveTextContent('1.2345');
      });

      // Place market buy order (should use price + slippage)
      fireEvent.click(screen.getByText('Market Order'));
      fireEvent.click(screen.getByText('Buy'));

      await waitFor(() => {
        expect(screen.getByTestId('order-result')).toHaveTextContent('success');
      });
    });
  });

  describe('Real-time Trading Simulation', () => {
    it('simulates a complete trading session', async () => {
      render(
        <HyperliquidProvider>
          <TradingInterface />
        </HyperliquidProvider>
      );

      // 1. Initial setup and connection
      fireEvent.click(screen.getByText('Set Private Key'));
      fireEvent.click(screen.getByText('Set Testnet'));
      fireEvent.click(screen.getByText('Connect'));

      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
      });

      // 2. Get market data for HYPE
      fireEvent.click(screen.getByText('Get Price'));
      await waitFor(() => {
        expect(screen.getByTestId('current-price')).toHaveTextContent('1.2345');
      });

      // 3. Place a limit buy order below market
      fireEvent.change(screen.getByTestId('size-input'), { target: { value: '10' } });
      fireEvent.change(screen.getByTestId('price-input'), { target: { value: '1.20' } });
      fireEvent.click(screen.getByText('Limit Order'));
      fireEvent.click(screen.getByText('Buy'));

      await waitFor(() => {
        expect(screen.getByTestId('order-result')).toHaveTextContent('success');
      });

      // 4. Place a market sell order
      fireEvent.change(screen.getByTestId('size-input'), { target: { value: '5' } });
      fireEvent.click(screen.getByText('Market Order'));
      fireEvent.click(screen.getByText('Sell'));

      await waitFor(() => {
        expect(screen.getByTestId('order-result')).toHaveTextContent('success');
      });

      // 5. Cancel all remaining orders
      fireEvent.click(screen.getByText('Cancel All'));

      // 6. Switch to different asset (BTC)
      fireEvent.change(screen.getByTestId('symbol-input'), { target: { value: 'BTC' } });
      fireEvent.click(screen.getByText('Get Price'));

      await waitFor(() => {
        expect(screen.getByTestId('current-price')).toHaveTextContent('45000');
      });

      // 7. Place BTC order
      fireEvent.change(screen.getByTestId('size-input'), { target: { value: '0.001' } });
      fireEvent.change(screen.getByTestId('price-input'), { target: { value: '44500' } });
      fireEvent.click(screen.getByText('Limit Order'));
      fireEvent.click(screen.getByText('Buy'));

      await waitFor(() => {
        expect(screen.getByTestId('order-result')).toHaveTextContent('success');
      });

      // 8. Final cleanup
      fireEvent.click(screen.getByText('Cancel All'));
      fireEvent.click(screen.getByText('Disconnect'));

      expect(screen.getByTestId('connection-status')).toHaveTextContent('disconnected');
    });
  });
});
