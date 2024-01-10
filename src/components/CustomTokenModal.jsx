import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import "../styles/customModal.css";
import { FiSearch } from "react-icons/fi";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { FaCircle } from "react-icons/fa";

export const CustomTokenModal = ({
  onCloseModal,
  tokenList,
  setToken,
  type,
  setTokenName,
  showModal,
  token,
  tokenName,
}) => {
  const [suggestions, setSugesstions] = useState(tokenList?.map((ele) => ele));
  const [selectedVal, setSelectedVal] = useState("");
  const [lengthError, setLengthError] = useState(false);

  const onChange = () => {};
  const handler = (e) => {
    // setSugesstions(tokenList?.filter((i) => i?.startsWith(e.target.value)));
    setSugesstions(
      tokenList?.filter((i) => {
        // console.log(i?.includes(e.target.value))
        return i?.toLowerCase().includes(e.target.value.toLowerCase());
      }),
    );
  };

  const handleChange = (e) => {
    const input = e.target.value;
    setSelectedVal(input);
    onChange(input);
  };

  return (
    <Modal
      onClose={onCloseModal}
      open={showModal}
      id="myModal"
      classNames={{
        overlay: "custom-token-modal-overlay",
        modal: "custom-token-modal-container",
      }}
      closeIcon={<MdClose className="custom-token-modal-close-button" />}
    >
      <div className="md:w-[90vw] w-[400px] position-relative m-auto">
        <div className="custom-token-modal">
          <div className="custom_modal_body ">
            {/*{type !== "etob" && <div className="fw-bold fs-4">W</div>}*/}
            <FiSearch className="text-gray-400 position-absolute left-[10%]" />
            <input
              // type="search"
              placeholder="Search Token"
              maxLength={"4"}
              value={selectedVal}
              onChange={handleChange}
              onKeyUp={handler}
              className="custom-token-modal-input "
            />
          </div>
          <div className="my-3 max-h-[300px] overflow-scroll">
            {suggestions?.length > 0 ? (
              suggestions?.map((el, index) => {
                return (
                  <div
                    className={`token_name font-syne my-2 ${
                      el === token && "token_name--active"
                    } `}
                    key={index}
                    onClick={() => {
                      setToken(el);
                      setTokenName(el);
                      onCloseModal();
                    }}
                  >
                    <FaCircle />
                    &nbsp;
                    {el.toUpperCase()}
                  </div>
                );
              })
            ) : (
              <div>
                <div
                  className="token_name font-syne"
                  onClick={() => {
                    if (selectedVal.length < 4) {
                      setLengthError(true);
                    } else {
                      setToken(selectedVal);
                      setTokenName(selectedVal);
                      onCloseModal();
                    }
                  }}
                >
                  {selectedVal}
                </div>
                {lengthError && <p>Name should be 4 letters</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
