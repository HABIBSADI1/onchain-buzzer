import { Router } from "express";

// The transaction router returns a JSON payload describing an
// ethereum transaction.  Farcaster clients will POST to this
// endpoint when a frame button is pressed.  The payload must
// include a chainId, method and params array compatible with
// eth_sendTransaction.

const router = Router();

// Retrieve runtime configuration.  CONTRACT_ADDRESS must be set via
// environment variables (either VITE_CONTRACT_ADDRESS or
// CONTRACT_ADDRESS).  BUZZ_VALUE_ETH defines the amount of ETH in
// decimal notation to send with each click.
const CONTRACT_ADDRESS: string | undefined =
  (process.env.VITE_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS) ?? undefined;
const CHAIN_ID = "eip155:8453";
const BUZZ_VALUE_ETH = process.env.BUZZ_VALUE_ETH || "0.00005";
// Selector for the click() function.  If your contract exposes a
// different payable method, update this to the appropriate 4‑byte
// selector.  An empty string omits the data field entirely.
const SELECTOR = process.env.TX_SELECTOR || "0x7d55923d";

// Convert a decimal ETH value into hex wei.  Handles up to 18
// decimals.  See: https://github.com/ethers-io/ethers.js/discussions/2387
function toHexWei(decimalEth: string): string {
  const [intPart, fracPartRaw = ""] = decimalEth.split(".");
  const fracPart = (fracPartRaw + "000000000000000000").slice(0, 18);
  const wei = BigInt(intPart || "0") * 10n ** 18n + BigInt(fracPart);
  return "0x" + wei.toString(16);
}

router.post("/", (req, res) => {
  if (!CONTRACT_ADDRESS) {
    res.status(500).json({ error: "Missing CONTRACT_ADDRESS environment" });
    return;
  }

  const payload = {
    chainId: CHAIN_ID,
    method: "eth_sendTransaction",
    params: [
      {
        to: CONTRACT_ADDRESS,
        // If SELECTOR is empty string, omit data.  Otherwise include it.
        ...(SELECTOR ? { data: SELECTOR } : {}),
        value: toHexWei(BUZZ_VALUE_ETH),
      },
    ],
  };

  // Instruct intermediate caches not to store the response.
  res.setHeader("Cache-Control", "no-store");
  res.json(payload);
});

export default router;
