import React, { useState } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { MdContentCopy, MdOutlineLock } from 'react-icons/md';
import { LuMinus } from 'react-icons/lu';
import { copyToClipboard } from '../../utils';
import { toast } from 'react-toastify';
import YoutubeEmbed from '../YoutubeEmbed';

const InscribeStep = (props) => {
  const {
    inscribeJSON,
    textJSON,
    inscribe,
    setProcessStep,
    unisatAddress,
    embedId,
    inscribeHandler
  } = props;
  const [inscriptionId, setInscriptionId] = useState('');
  const [inscriptionIdButton, setInscriptionIdButton] = useState(true);
  const [expandedState, setExpandedState] = useState(false);

  // console.log('expandedState', expandedState);

  const checkInscriptionId = (id) => {
    if (id.length === 66) {
      setInscriptionIdButton(false);
    } else {
      setInscriptionIdButton(true);
    }
  };
  const inscriptionHandler = ({ nextStep, setProcessStep }) => {
    setProcessStep((prev) => prev + 1);
    nextStep();
    props.setFinalInscriptionId(inscriptionId);
  };
  return (
    <>
      {props.currentStep === 1 && (
        <div
          className={`${!expandedState && 'inscribeForm_container'}`}
          //  style={{width: `${ expandedState && '100%'}`}}
        >
          <div
            className="inscribe_list_heading min-w-full  font-syne text-sm text-center"
            style={{ color: 'rgba(255, 255, 255, 0.70)' }}>
            {/* <div className="font-syne "></div> */}
            Inscribe this text via unisat website
          </div>

          {/* {inscribe && !expandedState && (
              <div
                className="w-full pt-4 flex items-center justify-end my-2 gap-2 cursor-pointer font-bold"
                onClick={() => {
                  copyToClipboard(JSON.stringify(textJSON));
                }}>
                Copy inscription JSON <MdContentCopy style={{ color: '#794EFF' }} />
              </div>
            )} */}

          <div
            className={`active_button rounded-lg font-syne text-s font-normal flex justify-between items-center`}
            style={{ color: 'ffffff' }}
            onClick={() => {
              setExpandedState(!expandedState);
            }}>
            <span>
              <span className="font-bold mr-2" style={{ color: '#B9A4F9' }}>
                Step 1:
              </span>
              <span>Inscribe on Unisat</span>
            </span>
            {expandedState ? <LuMinus className="w-6 h-6" /> : <IoIosAdd className="w-6 h-6" />}
          </div>

          {expandedState && (
            <div className="inscribe_json rounded-md">
              {inscribeJSON}
              <>
                <MdContentCopy
                  style={{ color: '#794EFF' }}
                  onClick={() => {
                    copyToClipboard(JSON.stringify(textJSON));
                  }}
                />
              </>
            </div>
          )}

          {inscribe && (
            <div
              className={`${
                inscribe ? 'active_button' : 'inactive_button'
              } rounded-lg font-syne text-s font-normal flex justify-between items-center`}
              style={{
                color: `${!inscribe ? 'rgba(255, 255, 255, 0.40)' : '#ffffff'}`
              }}>
              <span>
                <span
                  className="font-bold mr-2"
                  style={{ color: `${!inscribe ? '#B9A4F980' : '#B9A4F9'}` }}>
                  Step 2:
                </span>
                <span>Enter generated Inscription ID </span>
              </span>
              {inscribe ? <LuMinus className="w-6 h-6" /> : <MdOutlineLock className="w-6 h-6" />}
            </div>
          )}

          {inscribe && (
            <>
              <div className="inscribe_address_label">
                {/* <div className="step_number"></div>  */}
                {/* Enter inscription ID generated */}
                <a
                  href={`https://unisat.io/brc20?t=1687336457213&q=${unisatAddress}`}
                  target="_blank"
                  className="fw-normal font-syne text-sm font-normal"
                  style={{ color: '#7A6FF2' }}
                  rel="noreferrer">
                  Click here
                </a>
                <span className="font-syne text-sm font-normal">
                  to check the inscription ID you created.
                </span>
              </div>
              <div className="font-syne mt-4 text-base font-medium">Enter your generated ID</div>
              <input
                key="text"
                className="amount_input border-none font-syne text-4xl pl-4 pr-4 rounded-md"
                style={{ background: 'rgba(121, 78, 255, 0.20)' }}
                autoFocus="autoFocus"
                name="inscriptionId"
                type="text"
                // placeholder="Enter inscription id."
                value={props.inscriptionId}
                onChange={(e) => {
                  e.preventDefault();
                  setInscriptionId(e.target.value);
                  checkInscriptionId(e.target.value);
                }}
              />
              {inscriptionIdButton && inscriptionId.length > 0 && (
                <div className="error_text">Inscription Id must have 66 characters</div>
              )}
              {/* <div
                className='connect_wallet_button text-center bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl py-1 cursor-pointer'>
                <button
                  className={inscriptionIdButton ? 'inactive_button' : 'active_button'}
                  disabled={inscriptionIdButton}
                  onClick={() => {
                    inscriptionHandler({
                      nextStep: props.nextStep,
                      setProcessStep: setProcessStep
                    });
                  }}>
                  Transfer to OrdBridge
                </button>
                </div> */}
              <div
                className="connect_wallet_button text-center bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl py-1 cursor-pointer"
                style={{ width: '100%' }}
                onClick={
                  inscriptionIdButton
                    ? () => {
                        toast.warning('Please enter a valid inscription ID to proceed.');
                      }
                    : () => {
                        inscriptionHandler({
                          nextStep: props.nextStep,
                          setProcessStep: setProcessStep
                        });
                      }
                }>
                <button className="">
                  <span className="text-white font-syne text-xl">Transfer to OrdBridge</span>
                </button>
              </div>
            </>
          )}
          {!expandedState && !inscribe ? (
            <div className="youtube_container sm_yt flex flex-col">
              <div className="flex min-w-full">
                <YoutubeEmbed embedId={embedId} />
                <div className="fw-normal flex gap-2 flex-column">
                  {/* <AiOutlineYoutube color="#d9d9d9" fontSize={30} /> */}
                  <span className="font-syne text-xl">
                    A guide to follow on how to setup inscription
                  </span>
                  <span
                    className="font-syne text-xs"
                    style={{ color: 'rgba(255, 255, 255, 0.60)' }}>
                    2min 05s
                  </span>
                </div>
              </div>
              <div
                className="connect_wallet_button text-center bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl py-1 cursor-pointer"
                style={{ width: '100%' }}
                onClick={() => {
                  !inscribe &&
                    inscribeHandler({
                      nextStep: props.nextStep,
                      setProcessStep: setProcessStep
                    });
                }}>
                <button className="">
                  <span className="text-white font-syne text-xl">Inscribe on Unisat</span>
                </button>
              </div>
            </div>
          ) : (
            !inscribe && (
              <div
                className="connect_wallet_button text-center bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl py-1 cursor-pointer"
                style={{ width: '100%' }}
                onClick={() => {
                  !inscribe &&
                    inscribeHandler({
                      nextStep: props.nextStep,
                      setProcessStep: setProcessStep
                    });
                }}>
                <button className="">
                  <span className="text-white font-syne text-xl">Inscribe on Unisat</span>
                </button>
              </div>
            )
          )}
        </div>
      )}
    </>
  );
};

export default InscribeStep;
