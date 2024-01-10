import {
  getMint,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync
} from '@solana/spl-token';
import { Connection, PublicKey, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { Program, AnchorProvider, utils, web3, BN } from '@project-serum/anchor';
import idl from './idl.json';
import * as buffer from 'buffer';
import { toast } from 'react-toastify';
const utf8 = utils.bytes.utf8;
const programID = new PublicKey(idl.metadata.address);
const network = 'https://solana-mainnet.g.alchemy.com/v2/_XRDf1hVestAeoibLJ5UXs5JVdLOz0_x';
// const network = 'https://api.devnet.solana.com';

window.Buffer = buffer.Buffer;

const opts = {
  preflightCommitment: 'processed'
};

async function getProvider({ phantomProvider }) {
  /* create the provider and return it to the caller */
  /* network set to local network for now */
  const connection = new Connection(network, opts.preflightCommitment);

  let wallet = {
    publicKey: phantomProvider?._publicKey,
    signTransaction: phantomProvider.signTransaction,
    signAllTransactions: phantomProvider.signAllTransactions
  };

  const provider = new AnchorProvider(connection, wallet, opts.preflightCommitment);
  return provider;
}

export const viewDetails = async ({ phantomProvider, setMetamaskResponse, address }) => {
  try {
    const provider = await getProvider({ phantomProvider });
    const program = new Program(idl, programID, provider);
    let minTokenList = [];
    let pendingTickerList = [];
    const solAddress = new PublicKey(address);
    const [userAccountPDA] = await web3.PublicKey.findProgramAddress(
      [utf8.encode('user_account'), solAddress.toBuffer()],
      program.programId
    );
    const userData = await program.account.userAccount.fetch(userAccountPDA);
    userData.pendingClaims.map((e) => {
      pendingTickerList.push(e.ticker);
      minTokenList.push(e.amount.toString());
    });
    setMetamaskResponse([pendingTickerList, minTokenList]);
  } catch (err) {
    toast.error(err.message);
  }
};

export const burnHandler = async ({
  token,
  setStep,
  tokenValue,
  setClaimStatus,
  phantomProvider,
  toAddress,
  chain
}) => {
  const provider = await getProvider({ phantomProvider });
  const connection = new Connection(network, opts.preflightCommitment);
  const program = new Program(idl, programID, provider);
  try {
    const [globalStateAccountPDA] = await web3.PublicKey.findProgramAddress(
      [utf8.encode('global_state')],
      program.programId
    );

    const [configAccountPDA] = await web3.PublicKey.findProgramAddress(
      [utf8.encode('config')],
      program.programId
    );

    const [wrappedMintAccountPDA] = await web3.PublicKey.findProgramAddress(
      [utf8.encode('wrapped_mint'), utf8.encode(token)],
      program.programId
    );

    const [wrappedStateAccountPDA] = await web3.PublicKey.findProgramAddress(
      [utf8.encode('wrapped_state'), utf8.encode(token)],
      program.programId
    );

    const [userAccountPDA] = await web3.PublicKey.findProgramAddress(
      [utf8.encode('user_account'), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    const globalStateAct = await program.account.globalState.fetch(globalStateAccountPDA);

    const adminAuth = globalStateAct.adminAuthority;
    const signerAta = getAssociatedTokenAddressSync(
      wrappedMintAccountPDA,
      provider.wallet.publicKey,
      true
    );
    //vverify that chains value is solana
    let trans = await program.methods
      .burnTokens({
        ticker: token,
        amount: new BN(tokenValue),
        chain: chain.toLowerCase(),
        crossChainAddress: toAddress
      })
      .accounts({
        globalStateAccount: globalStateAccountPDA,
        configAccount: configAccountPDA,
        wrappedMintAccount: wrappedMintAccountPDA,
        wrappedStateAccount: wrappedStateAccountPDA,
        userAccount: userAccountPDA,
        signerAta: signerAta,
        admin: adminAuth,
        signer: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
      })
      .rpc();

    const wrappedStateAct = await program.account.wrappedStateAccount.fetch(wrappedStateAccountPDA);

    const mint = await getMint(connection, wrappedMintAccountPDA);

    setStep(4);
  } catch (error) {
    console.log('Error burning Solana tokens:', error.message);
    setStep(4);
    setClaimStatus('failure');
    toast.error(error.message);
  }
};

export const claimTokens = async ({ ticker, phantomProvider, setStep, setClaimStatus }) => {
  const provider = await getProvider({ phantomProvider });

  const connection = new Connection(network, opts.preflightCommitment);
  const program = new Program(idl, programID, provider);

  try {
    const [globalStateAccountPDA] = await web3.PublicKey.findProgramAddress(
      [utf8.encode('global_state')],
      program.programId
    );

    const [configAccountPDA] = await web3.PublicKey.findProgramAddress(
      [utf8.encode('config')],
      program.programId
    );

    const [wrappedMintAccountPDA] = await web3.PublicKey.findProgramAddress(
      [utf8.encode('wrapped_mint'), utf8.encode(ticker)],
      program.programId
    );

    const [wrappedStateAccountPDA] = await web3.PublicKey.findProgramAddress(
      [utf8.encode('wrapped_state'), utf8.encode(ticker)],
      program.programId
    );

    const [userAccountPDA] = await web3.PublicKey.findProgramAddress(
      [utf8.encode('user_account'), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    const globalStateAct = await program.account.globalState.fetch(globalStateAccountPDA);

    const adminAuth = globalStateAct.adminAuthority;
    const signerAta = getAssociatedTokenAddressSync(
      wrappedMintAccountPDA,
      provider.wallet.publicKey,
      true
    );
    const adminAta = getAssociatedTokenAddressSync(wrappedMintAccountPDA, adminAuth, true);

    let trans = await program.methods
      .claimTokens({
        ticker: ticker
      })
      .accounts({
        globalStateAccount: globalStateAccountPDA,
        configAccount: configAccountPDA,
        wrappedMintAccount: wrappedMintAccountPDA,
        wrappedStateAccount: wrappedStateAccountPDA,
        userAccount: userAccountPDA,
        signerAta: signerAta,
        adminAta: adminAta,
        admin: adminAuth,
        signer: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
      })
      .rpc();

    const wrappedStateAct = await program.account.wrappedStateAccount.fetch(wrappedStateAccountPDA);

    const mint = await getMint(connection, wrappedMintAccountPDA);

    const userData = await program.account.userAccount.fetch(userAccountPDA);
    setStep(4);
    setClaimStatus('success');
  } catch (err) {
    setStep(4);
    toast.error(err.message);
    setClaimStatus('failure');
    console.log('Transaction error: ', err);
  }
};
