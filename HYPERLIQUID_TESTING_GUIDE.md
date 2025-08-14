# Hyperliquid Functionality Testing Guide

## Overview
This guide provides comprehensive testing instructions for the Hyperliquid trading functionality in the PWA application.

## Prerequisites
- Node.js environment
- Hyperliquid testnet account (recommended)
- Basic understanding of spot trading

## Manual Testing

### 1. Connection Testing

#### Test Case 1.1: Initial Connection
**Steps:**
1. Navigate to `/pwa/settings`
2. Verify "Status: Disconnected" is shown
3. Leave private key and wallet address empty
4. Click "Connect"
5. Verify connection status updates to "Connected"
6. Check that mock data is being used (console logs should show "Mock Hyperliquid initialized")

**Expected Result:** 
- Connection succeeds with mock SDK
- No errors displayed
- Status shows "Connected"

#### Test Case 1.2: Testnet Connection with Private Key
**Steps:**
1. Generate a testnet private key from Hyperliquid testnet
2. Enter the private key in the "Private key" field
3. Set network to "Testnet"
4. Click "Connect"
5. Verify connection status

**Expected Result:**
- If hyperliquid package is available: Real connection to testnet
- If package not available: Falls back to mock SDK
- Status shows "Connected"

#### Test Case 1.3: Network Toggle
**Steps:**
1. Connect to testnet
2. Click "Mainnet" button
3. Click "Reconnect"
4. Verify warning about testnet-only usage

**Expected Result:**
- Network setting changes
- Reconnection attempt occurs
- Mock SDK should still be used for safety

### 2. Price Data Testing

#### Test Case 2.1: Get Price Data
**Steps:**
1. Navigate to `/pwa` (main trading page)
2. Ensure connection is established
3. Enter "HYPE" in the symbol field
4. Click "Get Price" button
5. Observe the price data display

**Expected Result:**
- Price data loads successfully
- Shows: Last Price, 24h Change, 24h Volume
- Mock data: Price ~1.2345, positive change percentage

#### Test Case 2.2: Different Symbol Testing
**Steps:**
1. Change symbol to "BTC" or another token
2. Click "Get Price"
3. Observe response

**Expected Result:**
- With mock SDK: Should work with any symbol
- With real SDK: Should handle unknown symbols gracefully

#### Test Case 2.3: Price Display Updates
**Steps:**
1. Get price for HYPE
2. Switch between Market and Limit order types
3. Verify price field behavior

**Expected Result:**
- Market orders: Price field should be empty/disabled
- Limit orders: Price field should populate with current market price

### 3. Order Entry Testing

#### Test Case 3.1: Market Order Placement
**Steps:**
1. Connect with testnet private key
2. Set order type to "Market"
3. Enter size (e.g., "0.1")
4. Click "Buy" button
5. Check console for order details

**Expected Result:**
- Order request is created correctly
- Mock SDK: Shows order placement in console
- Real SDK: Order submitted to testnet

#### Test Case 3.2: Limit Order Placement
**Steps:**
1. Set order type to "Limit"
2. Enter price (e.g., "1.2000")
3. Enter size (e.g., "0.1")
4. Click "Buy" button
5. Verify order parameters

**Expected Result:**
- Order includes limit price
- Price is correctly formatted
- Order type is set to limit

#### Test Case 3.3: Sell Order Testing
**Steps:**
1. Configure limit order
2. Click "Sell" button
3. Verify order direction

**Expected Result:**
- Order is marked as sell (isBuy: false)
- All other parameters correct

#### Test Case 3.4: Price Adjustment Controls
**Steps:**
1. Set to limit order
2. Enter price "1.2000"
3. Click "+" button multiple times
4. Click "-" button multiple times
5. Verify price changes

**Expected Result:**
- Price increases by 0.01 with each "+" click
- Price decreases by 0.01 with each "-" click
- Price doesn't go below 0

### 4. Order Management Testing

#### Test Case 4.1: Cancel All Orders
**Steps:**
1. Connect with testnet private key
2. Click "Cancel All" button
3. Check console/response

**Expected Result:**
- Cancel request is sent
- Mock SDK: Console shows cancellation
- Real SDK: All orders cancelled on testnet

### 5. Error Handling Testing

#### Test Case 5.1: No Private Key Error
**Steps:**
1. Disconnect from Hyperliquid
2. Don't enter private key
3. Try to place an order
4. Try to cancel orders

**Expected Result:**
- Error message: "Private key required to place orders (use testnet only)"
- Error message: "Private key required to cancel orders (use testnet only)"

#### Test Case 5.2: Invalid Symbol Error
**Steps:**
1. Enter an invalid symbol (e.g., "INVALID")
2. Try to get price data
3. Try to place order

**Expected Result:**
- With real SDK: "Could not find market for INVALID"
- With mock SDK: Should handle gracefully

#### Test Case 5.3: Connection Errors
**Steps:**
1. Simulate network issues
2. Try connecting
3. Try API calls

**Expected Result:**
- Appropriate error messages displayed
- App doesn't crash
- User can retry

### 6. Browser Environment Testing

#### Test Case 6.1: Server-Side Rendering
**Steps:**
1. Disable JavaScript in browser
2. Navigate to the app
3. Re-enable JavaScript

**Expected Result:**
- No hydration errors
- Proper fallback to browser-only functionality

## Performance Testing

### Test Case 7.1: Response Times
**Steps:**
1. Measure time for price data retrieval
2. Measure connection establishment time
3. Test with multiple rapid API calls

**Expected Result:**
- Price data loads within 2 seconds
- Connection completes within 5 seconds
- No rate limiting issues with mock SDK

### Test Case 7.2: Memory Usage
**Steps:**
1. Monitor browser memory usage
2. Perform multiple connections/disconnections
3. Place multiple orders

**Expected Result:**
- No memory leaks
- Stable memory usage over time

## Security Testing

### Test Case 8.1: Private Key Handling
**Steps:**
1. Enter private key
2. Check browser developer tools
3. Verify key storage

**Expected Result:**
- Private key not stored in localStorage
- Key only in component state
- Appropriate warnings about testnet usage

### Test Case 8.2: Network Validation
**Steps:**
1. Try connecting to mainnet with real private key
2. Verify safety measures

**Expected Result:**
- Warnings about testnet-only usage
- Mock SDK used for safety

## Automated Testing Notes

The following areas should be covered by automated tests:
1. Provider state management
2. API call formatting
3. Error handling
4. Mock SDK behavior
5. Price calculation logic
6. Order parameter validation

## Known Limitations

1. **Package Import**: The app gracefully falls back to mock SDK if hyperliquid package import fails
2. **Browser Only**: Hyperliquid SDK requires browser environment
3. **Testnet Recommended**: All private key operations should use testnet only
4. **Mock Data**: When using mock SDK, all data is simulated

## Troubleshooting

### Common Issues
1. **Import Error**: If hyperliquid package fails to import, mock SDK is used
2. **Connection Fails**: Check network and private key format
3. **Order Fails**: Verify sufficient balance and valid parameters
4. **Price Data Empty**: Check symbol exists and network connection

### Debug Information
- Check browser console for detailed logs
- Mock SDK operations are logged with "Mock" prefix
- Real SDK errors include API response details
