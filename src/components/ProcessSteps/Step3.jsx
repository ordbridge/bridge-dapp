import React from 'react';
import '../../styles/FormStep.css';
export const Step3 = ({ setStep, handleBack }) => {
  return (
    <>
      <div className="first_container">
        <div className="rounded-xl flex flex-col justify-center items-center swap-popup-container">
          {/* <img src="BackIcon.png" className="back_icon" onClick={handleBack} /> */}
          <header className="popup_header flex flex-col justify-center items-center">
            <img src="loader-ord.svg" className="w-[10rem]" alt="ord-Loader" />
            <div className="text-center">
              <div className="swap_header font-syne">Transaction in progress</div>
            </div>
          </header>
          <section className="form_data_section3 font-syne">
            <div>
              Please Wait... <br />
              We are verifying your transaction
            </div>
          </section>
          {/* <footer className="min-w-full flex items-center">
          </footer> */}
        </div>
      </div>
    </>
  );
};
