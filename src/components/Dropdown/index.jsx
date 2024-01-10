import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export const CustomDropdown = ({ Chain, appChains, setChain, type }) => {
  const [dropdownState, setDropdownState] = useState(false);
  const handleDropdownClick = () => {
    setDropdownState(!dropdownState);
  };

  return (
    <section className={`dropdown `}>
      <button onClick={handleDropdownClick} className="">
        <p className="flex items-center justify-end text-center bg-[#00000099] border-none text-white rounded-full cursor-pointer !mb-0 py-[12px] sm:!w-auto sm:!px-3 px-3 w-max ">
          <p className="flex items-center justify-center gap-1">
            <span className=" text-white  text-[13px] normal-case font-medium pt-0.5 font-syne">
              {type}
            </span>
            <span className="flex items-center sm:text-sm w-max gap-1">
              <img src={Chain?.icon} style={{ width: "20px" }} alt="" />{" "}
              {Chain?.tag}
            </span>
            {!dropdownState ? (
              <IoIosArrowDown className="font-white" />
            ) : (
              <IoIosArrowUp className="font-white" />
            )}
          </p>
        </p>
      </button>

      <span
        className={`dropdownItems p-3 ${
          dropdownState ? "isVisible" : "isHidden"
        }`}
        onClick={() => {
          handleDropdownClick();
        }}
      >
        {appChains.map((chain) => (
          <span
            className="dropdownItem hover:bg-[#120A33] hover:outline-none hover:rounded-md py-2 px-2"
            onClick={setChain(type === "To" ? false : true, chain)}
          >
            <span className="dropdown__link !w-max flex justify-start text-white gap-2 items-center">
              {" "}
              <img src={chain.icon} style={{ width: "20px" }} alt="" />{" "}
              {chain.tag}
            </span>
          </span>
        ))}
      </span>
    </section>
  );
};
