import { Router } from "express";
import { encodeFunctionData, parseEther } from "viem";
import { abi } from "./abi";

const router = Router();

/** ===== ENV =====
 * CONTRACT_ADDRESS      آدرس کانترکت
 * CHAIN_ID              مثل eip155:8453 یا 8453 (بسته به FORMAT)
 * BUZZ_VALUE_ETH        مثل 0.00005
 *
 * TX_PARAMS_ARRAY       'true' → params = [ { ... } ]  |  'false' → params = { ... }
 * TX_VALUE_FORMAT       'hex' | 'decimal'   (پیش‌فرض: hex)
 * TX_CHAINID_FORMAT     'caip' | 'number'   (پیش‌فرض: caip)
 * TX_INCLUDE_ABI        'true' | 'false'    (پیش‌فرض: false)
 */
const CONTRACT_ADDRESS =
  (process.env.VITE_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS) as `0x${string}`;

const RAW_CHAIN_ID = process.env.VITE_CHAIN_ID || process.env.CHAIN_ID || "eip155:8453";
const BUZZ_VALUE_ETH = process.env.BUZZ_VALUE_ETH || "0.00005";

const USE_ARRAY_PARAMS   = String(process.env.TX_PARAMS_ARRAY   ?? "true").toLowerCase() === "true";
const VALUE_FORMAT       = (process.env.TX_VALUE_FORMAT   || "hex").toLowerCase() as "hex" | "decimal";
const CHAINID_FORMAT     = (process.env.TX_CHAINID_FORMAT || "caip").toLowerCase() as "caip" | "number";
const INCLUDE_ABI        = String(process.env.TX_INCLUDE_ABI    ?? "false").toLowerCase() === "true";

// normalize chainId
function normalizeChainId(): string | number {
  if (CHAINID_FORMAT === "number") {
    const m = String(RAW_CHAIN_ID).match(/(\d+)$/);
    return m ? Number(m[1]) : Number(RAW_CHAIN_ID);
  }
  return RAW_CHAIN_ID.startsWith("eip155:") ? RAW_CHAIN_ID : `eip155:${RAW_CHAIN_ID}`;
}

// value → requested format
function toValue(eth: string): string {
  const wei = parseEther(eth);
  return VALUE_FORMAT === "hex" ? ("0x" + wei.toString(16)) : wei.toString();
}

const calldata = encodeFunctionData({
  abi,
  functionName: "click",
  args: [],
});

router.post("/", (_req, res) => {
  const chainId = normalizeChainId();
  const value   = toValue(BUZZ_VALUE_ETH);

  const txBase: Record<string, unknown> = {
    to: CONTRACT_ADDRESS,
    data: calldata,
    value,
  };
  if (INCLUDE_ABI) txBase.abi = abi; // بعضی کلاینت‌ها دوست ندارند؛ با ENV خاموش/روشن کن

  const payload =
    USE_ARRAY_PARAMS
      ? { method: "eth_sendTransaction", chainId, params: [txBase] }
      : { method: "eth_sendTransaction", chainId, params: txBase };

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(payload);
});

export default router;
