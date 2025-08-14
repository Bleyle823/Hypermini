import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { HyperliquidProvider } from '../../src/providers/hyperliquid-provider'
import { ThemeProvider } from '../../src/providers/theme-provider'

// Test utilities for Hyperliquid functionality

export const mockHyperliquidSDK = {
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn(),
  info: {
    spot: {
      getSpotMetaAndAssetCtxs: jest.fn().mockResolvedValue([
        {
          tokens: [
            { name: 'HYPE', szDecimals: 4 },
            { name: 'BTC', szDecimals: 8 },
            { name: 'ETH', szDecimals: 8 }
          ]
        },
        [
          {
            coin: 'HYPE-SPOT',
            midPx: '1.2345',
            prevDayPx: '1.2000',
            dayNtlVlm: '1000000.50'
          },
          {
            coin: 'BTC-SPOT',
            midPx: '45000.00',
            prevDayPx: '44000.00',
            dayNtlVlm: '50000000.00'
          },
          {
            coin: 'ETH-SPOT',
            midPx: '3200.00',
            prevDayPx: '3100.00',
            dayNtlVlm: '25000000.00'
          }
        ]
      ])
    }
  },
  exchange: {
    placeOrder: jest.fn().mockResolvedValue({ 
      status: 'success', 
      orderId: 'test-order-' + Date.now() 
    })
  },
  custom: {
    cancelAllOrders: jest.fn().mockResolvedValue({ status: 'success' })
  }
}

export const mockHyperliquidClass = jest.fn().mockImplementation(() => mockHyperliquidSDK)

// Mock the hyperliquid package
export function mockHyperliquidPackage() {
  jest.doMock('hyperliquid', () => ({
    Hyperliquid: mockHyperliquidClass
  }))
}

// Mock import failure
export function mockHyperliquidImportFailure() {
  jest.doMock('hyperliquid', () => {
    throw new Error('Package not found')
  })
}

// Test data
export const testPriceData = {
  HYPE: {
    price: 1.2345,
    dayChangePct: '2.88',
    volume: '1000000.50'
  },
  BTC: {
    price: 45000.00,
    dayChangePct: '2.27',
    volume: '50000000.00'
  },
  ETH: {
    price: 3200.00,
    dayChangePct: '3.23',
    volume: '25000000.00'
  }
}

export const testOrderParams = {
  buy: {
    coin: 'HYPE',
    isBuy: true,
    size: 0.1,
    limitPx: 1.25
  },
  sell: {
    coin: 'HYPE',
    isBuy: false,
    size: 0.1,
    limitPx: 1.20
  },
  market: {
    coin: 'HYPE',
    isBuy: true,
    size: 0.1,
    limitPx: null
  }
}

export const expectedOrderRequests = {
  limit: {
    coin: 'HYPE-SPOT',
    asset: 10000,
    is_buy: true,
    sz: 0.1,
    limit_px: 1.25,
    reduce_only: false,
    order_type: { limit: { tif: 'Gtc' } }
  },
  market: {
    coin: 'HYPE-SPOT',
    asset: 10000,
    is_buy: true,
    sz: 0.1,
    limit_px: 1.2469, // 1.2345 * 1.01 (slippage)
    reduce_only: false,
    order_type: { market: {} }
  }
}

// Provider wrapper for tests
const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <HyperliquidProvider>
        {children}
      </HyperliquidProvider>
    </ThemeProvider>
  )
}

// Custom render function with providers
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: AllProviders, ...options })
}

// Mock environment helpers
export function mockBrowserEnvironment() {
  const originalWindow = global.window
  return () => {
    global.window = originalWindow
  }
}

export function mockServerEnvironment() {
  const originalWindow = global.window
  delete (global as any).window
  return () => {
    global.window = originalWindow
  }
}

// Error handling test helpers
export const expectError = async (fn: () => Promise<any>, expectedMessage: string) => {
  try {
    await fn()
    throw new Error('Expected function to throw')
  } catch (error) {
    expect(error.message).toContain(expectedMessage)
  }
}

// Async testing helpers
export const waitForConnection = async (getByTestId: any) => {
  const { waitFor } = await import('@testing-library/react')
  await waitFor(() => {
    expect(getByTestId('connection-status')).toHaveTextContent('connected')
  }, { timeout: 5000 })
}

export const waitForError = async (getByTestId: any, expectedError: string) => {
  const { waitFor } = await import('@testing-library/react')
  await waitFor(() => {
    expect(getByTestId('error')).toHaveTextContent(expectedError)
  }, { timeout: 5000 })
}

// Reset all mocks helper
export const resetAllMocks = () => {
  jest.clearAllMocks()
  Object.values(mockHyperliquidSDK).forEach(method => {
    if (typeof method === 'function') {
      method.mockClear()
    } else if (typeof method === 'object') {
      Object.values(method).forEach(subMethod => {
        if (typeof subMethod === 'function') {
          subMethod.mockClear()
        } else if (typeof subMethod === 'object') {
          Object.values(subMethod).forEach(subSubMethod => {
            if (typeof subSubMethod === 'function') {
              subSubMethod.mockClear()
            }
          })
        }
      })
    }
  })
}
