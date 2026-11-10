import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';

/**
 * Base Denim Upgrade Configuration
 * - Denim activated on Base Mainnet on November 5, 2026
 * - Replaced Flashblocks with 200ms canonical blocks
 * - Polling interval optimized for 200ms native block production
 */
export const BASE_DENIM_CONFIG = {
  chainId: base.id, // 8453
  name: 'Base Mainnet (Denim)',
  blockTimeMs: 200,
  rpcUrl: 'https://mainnet.base.org',
  upgrade: 'Denim',
  status: 'active',
} as const;

export const config = createConfig({
  chains: [base],
  pollingInterval: 200, // 200ms canonical block polling for Denim
  transports: {
    [base.id]: http('https://mainnet.base.org', {
      batch: true,
      retryCount: 3,
      retryDelay: 200,
    }),
  },
});

