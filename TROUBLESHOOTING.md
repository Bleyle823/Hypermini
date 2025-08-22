# Troubleshooting Guide

## Common Issues and Solutions

### 1. "Failed to Submit Order" Error

This is the most common error when trying to buy or sell HYPE. Here are the steps to resolve it:

#### Step 1: Check Environment Variables
Make sure you have a `.env.local` file in your project root with the following variables:

```env
# Required: Builder's wallet address for fee collection
NEXT_PUBLIC_BUILDER_ADDRESS=your_actual_builder_address_here

# Required: RPC URL for blockchain connection
NEXT_PUBLIC_RPC_URL=https://arbitrum-sepolia.drpc.org

# Required: Builder fee percentage (in basis points)
NEXT_PUBLIC_BUILDER_FEE=10

# Required: Environment mode
NEXT_PUBLIC_NODE_ENV=development
```

**Important**: Replace `your_actual_builder_address_here` with a real wallet address, not the placeholder `0x0000000000000000000000000000000000000000`.

#### Step 2: Verify Configuration
1. Go to the **Settings** tab in the app
2. Click **"Check Configuration"** button
3. Review the results and fix any errors

#### Step 3: Check Prerequisites
Before trading, you must complete these steps in order:

1. **Connect Wallet** - Connect your wallet using Farcaster
2. **Approve Builder Fee** - Approve the builder fee for trading
3. **Approve Agent** - Create and approve your trading agent

#### Step 4: Check Console Logs
Open your browser's Developer Tools (F12) and check the Console tab for detailed error messages. The improved error handling will now show specific issues like:

- Insufficient balance
- Invalid order size
- API connection problems
- Configuration errors

### 2. Insufficient Balance Errors

- **For Buy Orders**: Ensure you have enough USDC to cover the order amount
- **For Sell Orders**: Ensure you have enough HYPE tokens to sell
- **Minimum Order Size**: Orders must be at least 0.001 HYPE

### 3. API Connection Issues

If you see "API endpoint unreachable" errors:

1. Check your internet connection
2. Verify the API endpoints are accessible:
   - Testnet: `https://api.hyperliquid-testnet.xyz`
   - Mainnet: `https://api.hyperliquid.xyz`
3. Try refreshing the page

### 4. Wallet Connection Issues

- Ensure you're using a supported wallet (MetaMask, WalletConnect, etc.)
- Check if your wallet is connected to the correct network (Arbitrum Sepolia for testnet)
- Try disconnecting and reconnecting your wallet

### 5. Agent Approval Issues

If agent approval fails:

1. Make sure you've completed the builder fee approval first
2. Check that your wallet has enough native tokens for gas fees
3. Verify the transaction in your wallet's transaction history

## Debug Mode

The app now includes comprehensive logging. To see detailed information:

1. Open Developer Tools (F12)
2. Go to Console tab
3. Try to submit an order
4. Look for detailed logs showing:
   - Order construction details
   - API requests and responses
   - Error details and stack traces

## Getting Help

If you're still experiencing issues:

1. Check the console logs for specific error messages
2. Verify your environment variables are set correctly
3. Ensure you've completed all prerequisite steps
4. Check the Hyperliquid documentation for API changes
5. Open an issue in the GitHub repository with:
   - Error message from console
   - Steps to reproduce
   - Your environment configuration (without sensitive data)

## Environment Setup Checklist

- [ ] `.env.local` file created with required variables
- [ ] `NEXT_PUBLIC_BUILDER_ADDRESS` set to real address
- [ ] `NEXT_PUBLIC_RPC_URL` configured
- [ ] `NEXT_PUBLIC_BUILDER_FEE` set to desired percentage
- [ ] `NEXT_PUBLIC_NODE_ENV` set to `development` or `production`
- [ ] Wallet connected and on correct network
- [ ] Builder fee approved
- [ ] Agent created and approved
- [ ] Sufficient balance for trading
- [ ] API endpoints accessible
