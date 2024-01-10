import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

//metadata pda
export function getMetadataPda(mint) {
  const [metadataPda, _] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("metadata"),
      new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
      mint.toBuffer(),
    ],
    new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
  );
  return metadataPda;
}

//master edition pda
export function getMasterEditionPda(mint) {
  const [masterEditionPda, _] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("metadata"),
      new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
      mint.toBuffer(),
      anchor.utils.bytes.utf8.encode("edition"),
    ],
    new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
  );
  return masterEditionPda;
}

//master edition pda
export function getTokenRecord(mint, ata) {
  const [TokenRecord, _] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("metadata"),
      new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
      mint.toBuffer(),
      anchor.utils.bytes.utf8.encode("token_record"),
      ata.toBuffer(),
    ],
    new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
  );
  return TokenRecord;
}

//master edition pda
export function getMetadataDelegateRecord(
  mint,
  ata,
  delegate,
  updateAuthority,
) {
  const [pda, _] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("metadata"),
      new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
      mint.toBuffer(),
      anchor.utils.bytes.utf8.encode("update"),
      updateAuthority.toBuffer(),
      delegate.toBuffer(),
    ],
    new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
  );
  return pda;
}

export function getGlobalState(ordoProgram) {
  const [pda, _] = PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("global_state")],
    new PublicKey(ordoProgram),
  );
  return pda;
}

export function getConfig(ordoProgram) {
  const [pda, _] = PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("config")],
    new PublicKey(ordoProgram),
  );
  return pda;
}

export function getWrappedMint(ordoProgram, ticker) {
  const [pda, _] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("wrapped_mint"),
      anchor.utils.bytes.utf8.encode(ticker),
    ],
    new PublicKey(ordoProgram),
  );
  return pda;
}

export function getWrappedState(ordoProgram, ticker) {
  const [pda, _] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("wrapped_state"),
      anchor.utils.bytes.utf8.encode(ticker),
    ],
    new PublicKey(ordoProgram),
  );
  return pda;
}

export function getUserAccount(ordoProgram, address) {
  const [pda, _] = PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("user_account"), address.toBytes()],
    new PublicKey(ordoProgram),
  );
  return pda;
}
