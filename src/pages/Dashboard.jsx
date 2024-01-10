import React, { useEffect, useState } from "react";
import axios from "axios";
import Web3 from "web3";
import AVAX_ABI from "../utils/avax";
import ETH_ABI from "../utils/eth";
import ProofOfReserve from "../components/ProofOfReserve";
import { getWeb3UrlByTag } from "../utils/chains";

const DashboardStatCard = ({ title, value }) => {
  return (
    <div className="dashboard-stat-card">
      <p className="dashboard-stat-card--title">{title.toUpperCase()}</p>
      <h4 className="dashboard-stat-card--value">{value}</h4>
    </div>
  );
};

const Dashboard = ({ appChains }) => {
  const [statsData, setStatsData] = useState({});
  const [reservesData, setReservesData] = useState([]);

  const ethChain = appChains[0];
  const avaxChain = appChains[2];
  const arbiChain = appChains[3];
  const baseChain = appChains[4];

  const ethWeb3 = new Web3(getWeb3UrlByTag(ethChain.tag));
  const avaxWeb3 = new Web3(getWeb3UrlByTag(avaxChain.tag));
  const arbiWeb3 = new Web3(getWeb3UrlByTag(arbiChain.tag));
  const baseWeb3 = new Web3(getWeb3UrlByTag(baseChain.tag));

  const ethContractHandler = new ethWeb3.eth.Contract(
    ETH_ABI,
    ethChain.contractAddress,
  );
  const avaxContractHandler = new avaxWeb3.eth.Contract(
    AVAX_ABI,
    avaxChain.contractAddress,
  );
  const arbiContractHandler = new arbiWeb3.eth.Contract(
    AVAX_ABI,
    arbiChain.contractAddress,
  );
  const baseContractHandler = new baseWeb3.eth.Contract(
    AVAX_ABI,
    baseChain.contractAddress,
  );

  useEffect(() => {
    (async () => {
      const res = await axios.get("https://api.ordbridge.io/bapi/reporting");
      setStatsData(res?.data?.data?.[0]);
    })();
    (async () => {
      const res = await axios.get(
        "https://api.ordbridge.io/bapi/token/btc/balance",
      );
      const balanceList = res?.data?.data?.[0].balanceList;
      const balances = balanceList.map((item) => ({
        token: item.token,
        balance: item.balance,
      }));
      setReservesData(balances);
    })();
  }, []);

  return (
    <div className="font-syne text-white backdrop-blur-xl">
      <div className="container md:px-[30px] py-[50px] min-h-screen">
        <h1 className="dashboard-heading">DASHBOARD</h1>
        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-1 gap-5 text-white">
          <DashboardStatCard
            title="Price"
            value={`$${
              statsData?.lastPrice
                ? `${statsData.lastPrice.substring(0, 7)}`
                : "Loading..."
            }`}
          />
          <DashboardStatCard
            title="Total Volume"
            value={`$${
              statsData?.lastPrice
                ? `${(210 * Number(statsData.lastPrice))
                    .toString()
                    .substring(0, 7)}M`
                : "Loading..."
            }`}
          />
        </div>
        <h1 className="dashboard-heading mt-10">PROOF OF RESERVES</h1>
        <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-x-3 gap-y-5">
          {reservesData.map((item) => (
            <ProofOfReserve
              token={item}
              avaxWeb3={avaxWeb3}
              ethWeb3={ethWeb3}
              arbiWeb3={arbiWeb3}
              baseWeb3={baseWeb3}
              avaxContractHandler={avaxContractHandler}
              ethContractHandler={ethContractHandler}
              arbiContractHandler={arbiContractHandler}
              baseContractHandler={baseContractHandler}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
