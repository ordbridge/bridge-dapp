import React, { useEffect, useMemo, useState } from "react";
import { LiaStickyNoteSolid } from "react-icons/lia";
import { AiOutlineYoutube, AiOutlineCheckCircle } from "react-icons/ai";
import "../../styles/FormStep.css";
import { toast } from "react-toastify";
import StepWizard from "react-step-wizard";
import { fetchFeeRate, inscribeService, transferService } from "../../services/homepage.service";
import { ThreeDots } from "react-loader-spinner";
import YoutubeEmbed from "../YoutubeEmbed";

import InscribeStep from "../InscribeStep/InscribeStep";

export const Step1 = ({
    ethChain = {},
    setStep,
    res,
    metaMaskAddress,
    unisatAddress,
    session_key,
    callContractFunction,
    metaMaskResponse,
    loader,
    setLoader,
    pendingInscriptionId,
    claimButton,
    setClaimButton,
    startInterval,
    setPendingEntryPopup
}) => {
    const appChainKey = ethChain?.key ?? "";

    const [networkType, setNetworkType] = useState("testnet");
    const [inscribe, setInscribe] = useState(false);
    const [transferred, setTransferred] = useState(false);
    const [hideContent, setHideContent] = useState(true);
    const [inscriptionAddress, setInscriptionAddress] = useState(pendingInscriptionId);
    const [finalInscriptionId, setFinalInscriptionId] = useState("");
    const [transferLoader, setTransferLoader] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [processStep, setProcessStep] = useState(0);
    const [embedId, setEmbedId] = useState("oRRauF_tzV8");
    const [feeRate, setFeeRate] = useState("");
    useEffect(() => {
        if (pendingInscriptionId) {
            setInscribe(true);
        }

        fetchFeeRate().then((res) => {
            setFeeRate(Math.floor(res.limits["min"] + res.limits["max"]) / 2);
        });
    }, []);
    const transferInscrptionHandler = async () => {
        setTransferLoader(true);
        try {
            const data = await window.unisat.sendInscription(
                "bc1q0yufnf24ksfcj8vg32rrmun87vltnrfg6qzd7x",
                finalInscriptionId,
                {
                    feeRate: feeRate
                }
            );
            setTransferred(true);
            setTransferLoader(false);
            setLoader(true);
            startInterval();
            setHideContent(false);
        } catch (error) {
            setTransferLoader(false);
            toast.error(error.message);
        }
        // transferService({ session_key: session_key, InscriptionId: inscriptionAddress }).then((res) => {
        //   setInscriptionIdButton(true);
        //   setTransferred(true);
        //   setTransferLoader(false);
        //   setLoader(true);
        //   startInterval();
        // });
    };

    const inscribeHandler = async ({ nextStep, setProcessStep }) => {
        await inscribeService({
            res: res,
            metaMaskAddress: metaMaskAddress,
            unisatAddress: unisatAddress
        });
        window.open("https://unisat.io/inscribe", "_blank");
        setInscribe(true);
        // setTimeout(() => {
        //   setProcessStep((prev) => prev + 1);
        //   nextStep();
        // }, 2000);
        // inscribeService({ res, metaMaskAddress, unisatAddress, session_key }).then((res) => {
        //   setInscriptionAddress(res?.inscription_id);
        //   setInscribe(true);
    };

    const switchNetworkHandler = async () => {
        try {
            let res = await window.unisat.switchNetwork(networkType);
            setNetworkType((prev) => (prev === "testnet" ? "livenet" : "testnet"));
        } catch (e) {
            console.log(e);
        }
    };
    const handleStepChange = (e) => {
        setActiveStep(e.activeStep - 1);
    };

    let inscribeJSON = (
        <>
            {" "}
            {"{"}
            <br />
            "p": "{res?.inscribe?.p}", <br />
            "op": "{res?.inscribe?.op}", <br />
            "tick": "{res?.inscribe?.tick}", <br />
            "amt": "{res?.inscribe?.amt}", <br />"{appChainKey}": "{res?.inscribe?.[appChainKey]}"
            <br />
            {"}"}
        </>
    );

    let textJSON = {
        p: `${res?.inscribe?.p}`,
        op: `${res?.inscribe?.op}`,
        tick: `${res?.inscribe?.tick}`,
        amt: `${res?.inscribe?.amt}`
    };
    textJSON[appChainKey] = `${res?.inscribe?.[appChainKey]}`;

    const TransferStep = () => {
        return (
            <div className="transfer_section md:p-5 ">
                {hideContent && (
                    <>
                        <div className="inscribe_list_heading font-syne">
                            You're sending 'transfer' inscription to given OrdBridge Wallet.
                        </div>
                        <div className="inscribe_address_label w-min-full font-syne">
                            bc1q0yufnf24ksfcj8vg32rrmun87vltnrfg6qzd7x
                        </div>
                        <button
                            className={
                                "active_button text-white font-syne text-xl connect_wallet_button text-center bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl py-1 cursor-pointer"
                            }
                            onClick={() => {
                                transferInscrptionHandler();
                            }}>
                            Send to OrdBridge
                        </button>
                    </>
                )}

                {loader && (
                    <div className="min-w-full flex flex-col justify-center items-center">
                        <div className="waiting_text fs-5 fw-bolder">
                            Your transaction has been sent successfully!
                        </div>
                        <AiOutlineCheckCircle color="green" className="fs-1 ms-2" />
                        <div className="waiting_text fs-6 fw-normal">
                            Kindly wait for 2 blocks confirmation (around 30mins). <br />
                            <b className="font-bold">
                                You can close the tab and come back later in pending entries to
                                claim.
                            </b>
                        </div>
                        <div className="min-w-full flex justify-center text-center mt-4">
                            <img src="infinity.gif" className="infinity" />
                        </div>
                        <div className="waiting_text fs-5 fw-bold">Waiting for confirmation</div>
                    </div>
                )}

                {claimButton && (
                    <footer className="claim_button_container">
                        <button
                            className="connect-wallet claim_button"
                            onClick={() => {
                                setClaimButton(false);
                                setStep(2);
                            }}>
                            Claim
                        </button>
                    </footer>
                )}
            </div>
        );
    };
    return (
        <>
            <div className="first_container">
                <div className="form2_container rounded-3xl background_popup">
                    <div className="form_container">
                        {/* <img src="BackIcon.png" className="back_icon" /> */}
                        <header className="popup_header">
                            <div className="text-center">
                                <div className="swap_header modal_head_gradient_text font-syne">
                                    {/* <div className="step_number">1</div>  */}
                                    Inscribe & transfer
                                </div>
                            </div>
                        </header>
                        <section className="form_data_section">
                            {/* <Stepper activeStep={processStep}>
              <Step label="Inscribe" />
              <Step label="Transfer" />
            </Stepper> */}
                            <StepWizard onStepChange={handleStepChange}>
                                {/* {!pendingInscriptionId && ( */}
                                <InscribeStep
                                    setProcessStep={setProcessStep}
                                    setFinalInscriptionId={setFinalInscriptionId}
                                    inscribeHandler={inscribeHandler}
                                    inscribeJSON={inscribeJSON}
                                    textJSON={textJSON}
                                    inscribe={inscribe}
                                    unisatAddress={unisatAddress}
                                    embedId={embedId}
                                />
                                {/* )} */}
                                <TransferStep />
                            </StepWizard>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};
