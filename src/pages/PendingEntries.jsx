import React, { useEffect, useState } from 'react';
import { Dropdown } from 'flowbite-react';
import Web3 from 'web3';
import { Connection, PublicKey } from '@solana/web3.js';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from 'react-icons/io';
import ETH_ABI from '../utils/eth';
import AVAX_ABI from '../utils/avax';
import Text from '../components/Text';
import { getUserAccount } from '../utils/pdas';
import { getChainByTag, getWeb3UrlByTag } from '../utils/chains';
import { pendingEntryService } from '../services/homepage.service';
import idl from '../utils/idl.json';
import { Program, AnchorProvider, utils, web3, BN } from '@project-serum/anchor';
import { getMint } from '@solana/spl-token';
import '../styles/pending-entries.css';
import usePhantomWallet from '../hooks/usePhantomWallet';
import { claimTokens, viewDetails } from '../utils/solanaHandler';
import { ThreeDots } from 'react-loader-spinner';

export const PendingEntries = ({
  appChains,
  toChain,
  setToChain,
  setFromChain,
  sessionKey,
  unisatAddress,
  metaMaskAddress,
  phantomAddress,
  setPendingEntryPopup,
  setStep,
  setPendingInscriptionId,
  callContractHandler,
  ClaimEntriesData,
  setPendingEntriesDataById,
  setClaimButton,
  setClaimStatus,
  setMetamaskResponse,
  setTokenName,
  setInitiateBridgeResponse,
  chain,
  connectMetamaskWallet,
  fromChain
}) => {
  const navigate = useNavigate();
  const [isPendingEntriesLoading, setIsPendingEntriesLoading] = useState(false);

  const { provider: phantomProvider } = usePhantomWallet();
  const opts = {
    preflightCommitment: 'processed'
  };
  const val = 1000000000000000000;
  const [unprocessedEntries, setUnprocessedEntries] = useState([]);
  const [filterUnprocessedEntries, setFilterUnprocessedEntries] = useState([]);
  const [pendingTickers, setPendngTickers] = useState([]);

  const [chainTypeFilter, setChainTypeFilter] = useState({
    name: fromChain.tag,
    icon: fromChain.icon
  });
  const [unprocessedFilter, setUnProcessedFilter] = useState({
    name: fromChain.tag,
    icon: fromChain.icon
  });
  useEffect(() => {
    if (fromChain.tag === 'SOL' && phantomAddress) {
      viewDetails({ phantomProvider, setMetamaskResponse, address: phantomAddress, setStep });
    }
  }, []);

  useEffect(() => {
    setClaimButton(false);
    setClaimStatus('success');
    if (sessionKey) {
      // TODO: The API endpoint to grab the solana based transactions doesn't exist.
      // It could be as simple as replacing metaMaskAddress with phantomAddress here,
      // but we shoould probably have better naming
      pendingEntryService({
        session_key: sessionKey,
        unisatAddress: unisatAddress,
        metaMaskAddress: metaMaskAddress
      }).then((res) => {
        setUnprocessedEntries(res?.unprocessed);
        const filterData = res?.unprocessed?.filter((ele) => ele.chain === fromChain.chain_flag);
        setFilterUnprocessedEntries(filterData);
        if (fromChain.tag !== 'SOL') callContractHandler(res?.pending_tickers);
        setPendngTickers(res?.pending_tickers);
      });
    } else {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setEntriesNetwork = async ({ name, icon }) => {
    setChainTypeFilter({ name, icon });
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const requestedChain = getChainByTag(name);

    if (chainId !== requestedChain.chainId) {
      connectMetamaskWallet(requestedChain.chainId);
    }

    // if (toChain.isEvm) {
    //   setToChain(requestedChain);
    // } else {
    //   setFromChain(requestedChain);
    // }
  };

  const getPendingEntries = async ({ type }) => {
    setIsPendingEntriesLoading(true);

    try {
      if (type === 'SOL' && phantomAddress) {
        await viewDetails({
          phantomProvider,
          setMetamaskResponse,
          address: phantomAddress,
          setStep
        });
      } else {
        const requestedChain = getChainByTag(type);
        const web3 = new Web3(getWeb3UrlByTag(type));
        const appContractAddress = requestedChain.contractAddress;
        const ABI = type === 'ETH' ? ETH_ABI : AVAX_ABI;
        const contractHandler = new web3.eth.Contract(ABI, appContractAddress);
        try {
          const result = await contractHandler.methods
            .checkPendingERCToClaimForWalletWithTickers(metaMaskAddress, pendingTickers)
            .call();
          setMetamaskResponse(result);
        } catch (error) {
          console.error(error);
        }
      }
    } catch (_) {
    } finally {
      setIsPendingEntriesLoading(false);
    }
  };

  const claimEntriesColumns = ['Ticker', 'Amount', 'Wallet Address', 'Actions'];
  return (
    <div className="pending_container pb-8 px-[8%]">
      <div className="flex !w-full gap-2 justify-start mb-4 items-center">
        <Text
          className="bg-clip-text bg-gradient6 md:text-[38px] text-3xl text-transparent text-center !mb-0"
          size="txtSyneBold40DeeppurpleA200">
          Claim pending entries
        </Text>
        <Dropdown
          className="p-0 m-0 border-red z-10 max-w-[120px] border-none"
          dismissOnClick={true}
          renderTrigger={() => (
            <div className="flex items-center justify-center text-center px-4 border-none text-white rounded-full !w-max !mb-0 cursor-pointer gap-2">
              <div className="flex justify-center text-white gap-2 items-center !mb-0 font-syne">
                <img src={chainTypeFilter.icon} className="w-[20px]" alt={chainTypeFilter.name} />
                {chainTypeFilter.name}
              </div>
              <IoIosArrowDown className="font-white" />
            </div>
          )}>
          {appChains.map((ele, index) => {
            if (ele.tag !== 'BRC') {
              return (
                <Dropdown.Item
                  className="hover:outline-none bg-black"
                  onClick={() => {
                    if (ele.tag !== 'SOL') setEntriesNetwork({ name: ele.tag, icon: ele.icon });
                    if (ele.tag === 'SOL') {
                      setChainTypeFilter({ name: ele.tag, icon: ele.icon });
                    }
                    setFromChain(ele);
                    setToChain(appChains?.filter((ele) => ele.tag === 'BRC')[0]);
                    getPendingEntries({ type: ele.tag });
                  }}>
                  <div
                    className={`w-full flex justify-start text-white gap-2 items-center !mb-0 my-1 `}>
                    <img src={ele.icon} className="w-[20px]" alt={ele.tag} />
                    {ele.tag}
                  </div>
                </Dropdown.Item>
              );
            }
          })}
        </Dropdown>
      </div>
      <div className="claim_container flex flex-col h-max inset-[0] items-center justify-center px-12 md:px-10 sm:px-5 rounded-3xl mb-8">
        <div className="min-w-full flex gap-2 justify-start border-b-[0.5px] border-b-solid border-b-[#5E4B92]">
          {claimEntriesColumns?.map((ele, index) => (
            <div className="min-w-1/4 flex justify-center py-3 mb-0 ">
              <p className="min-w-1/4 text-base w-auto !mb-0 font-syne text-[#666687] ">{ele}</p>
            </div>
          ))}
        </div>
        {!isPendingEntriesLoading && ClaimEntriesData?.[0]?.length > 0 ? (
          ClaimEntriesData[0]?.map((ele, index) => {
            return (
              <div
                className="min-w-full flex items-center py-3 text-base font-normal text-[#FFF] font-grostek "
                style={{
                  borderBottom: index !== ClaimEntriesData[0]?.length - 1 && '0.5px solid #5E4B92'
                }}>
                <div className="min-w-1/4 flex justify-center">{ele}</div>
                <div className="min-w-1/4 flex justify-center">
                  {chainTypeFilter?.name !== 'SOL'
                    ? ClaimEntriesData[1][index] / val
                    : ClaimEntriesData[1][index]}
                </div>
                <div className="min-w-1/4 flex justify-center">
                  {chainTypeFilter?.name === 'SOL'
                    ? phantomAddress?.slice(0, 10)
                    : metaMaskAddress?.slice(0, 10)}
                  ...
                </div>
                <div className="min-w-1/4 flex justify-center ">
                  <p
                    className="rounded-2xl py-1 px-3 cursor-pointer !mb-0 text-sm font-normal"
                    style={{ border: '0.5px solid rgba(255, 255, 255, 0.10)' }}
                    onClick={() => {
                      // if (fromChain?.tag !== 'SOL') {
                      setPendingEntryPopup((prev) => !prev);
                      setStep(2);
                      setPendingEntriesDataById([[ele], [ClaimEntriesData[1][index]]]);
                      // } else {
                      //   claimTokens({ ticker: ele, phantomProvider,setStep });
                      // }
                    }}>
                    Claim Entry
                  </p>
                </div>
              </div>
            );
          })
        ) : !isPendingEntriesLoading ? (
          <Text
            className="text-xl md:text-base text-white-A700_b2 mt-4 !font-normal text-white opacity-70 mb-4 "
            size="txtSyneSemiBold24WhiteA700b2">
            No pending claim entries found
          </Text>
        ) : (
          <div className="flex min-w-full justify-center">
            <Text
              className="text-xl md:text-base text-white-A700_b2 mt-4 !font-normal text-white opacity-70 !mb-0"
              size="txtSyneSemiBold24WhiteA700b2">
              Loading
            </Text>
            <div className="max-w-[70px]">
              <ThreeDots width="60" color="#ffffff" />
            </div>
          </div>
        )}
      </div>
      <div className="flex !w-full gap-2 justify-start mb-4 items-center mt-4">
        <Text
          className="bg-clip-text bg-gradient6 md:text-[38px] text-3xl text-transparent text-center !mb-0"
          size="txtSyneBold40DeeppurpleA200">
          Unprocessed Entries
        </Text>
        <Dropdown
          className="p-0 m-0 border-red z-10 max-w-[120px] border-none"
          dismissOnClick={true}
          renderTrigger={() => (
            <div className="flex items-center justify-center text-center py-2 px-4 border-none text-white rounded-full !w-max !mb-0 cursor-pointer gap-2">
              <div className="flex justify-center text-white gap-2 items-center !mb-0 font-syne">
                <img
                  src={unprocessedFilter.icon}
                  className="w-[20px]"
                  alt={unprocessedFilter.name}
                />
                {unprocessedFilter.name}
              </div>
              <IoIosArrowDown className="font-white" />
            </div>
          )}>
          {appChains.map((ele, index) => {
            if (ele.tag !== 'BRC') {
              return (
                <Dropdown.Item
                  className="hover:outline-none bg-black"
                  onClick={() => {
                    setUnProcessedFilter({ name: ele.tag, icon: ele.icon });
                    const filterData = unprocessedEntries?.filter(
                      (elem) => elem.chain === ele.chain_flag
                    );
                    setFilterUnprocessedEntries(filterData);
                  }}>
                  <div
                    className={`w-full flex justify-start text-white gap-2 items-center !mb-0 my-1`}>
                    <img src={ele.icon} className="w-[20px]" alt={ele.tag} />
                    {ele.tag}
                  </div>
                </Dropdown.Item>
              );
            }
          })}
        </Dropdown>
      </div>
      <div className="claim_container flex flex-col h-max inset-[0] items-center justify-center px-12 md:px-10 sm:px-5 rounded-3xl">
        <div className="min-w-full flex gap-2 justify-start border-b-[0.5px] border-b-solid border-b-[#5E4B92]">
          {claimEntriesColumns?.map((ele, index) => (
            <div className="min-w-1/4 flex justify-center py-3 mb-0 ">
              <p className="min-w-1/4 text-base w-auto !mb-0 font-syne text-[#666687] ">{ele}</p>
            </div>
          ))}
        </div>
        {filterUnprocessedEntries?.length > 0 ? (
          filterUnprocessedEntries?.map((ele, index) => {
            return (
              <div
                className="min-w-full flex items-center py-3 text-base font-normal text-[#FFF] font-grostek"
                style={{
                  borderBottom:
                    index !== filterUnprocessedEntries?.length - 1 && '0.5px solid #5E4B92'
                }}>
                <div className="min-w-1/4 flex justify-center">
                  {ele?.transaction_data?.inscribe_json?.tick}
                </div>
                <div className="min-w-1/4 flex justify-center">
                  {ele?.transaction_data?.inscribe_json?.amt}
                </div>
                <div className="min-w-1/4 flex justify-center">
                  {ele?.transaction_data?.metamask_address?.slice(0, 10)}...
                </div>
                <div className="min-w-1/4 flex justify-center">
                  <p
                    className="rounded-2xl py-1 px-3 cursor-pointer !mb-0 text-sm font-normal"
                    style={{ border: '0.5px solid rgba(255, 255, 255, 0.10)' }}
                    onClick={() => {
                      setPendingEntryPopup((prev) => !prev);
                      setPendingInscriptionId(ele?.inscription_id);
                      setInitiateBridgeResponse({
                        inscribe: ele?.transaction_data?.inscribe_json
                      });
                      setTokenName(ele?.transaction_data?.inscribe_json?.tick);
                      setStep(1);
                    }}>
                    Process Entry
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <Text
            className="text-xl md:text-base text-white-A700_b2 mt-4 !font-normal text-white opacity-70 mb-4"
            size="txtSyneSemiBold24WhiteA700b2">
            No Unprocessed entries found
          </Text>
        )}
      </div>
    </div>
  );
};
