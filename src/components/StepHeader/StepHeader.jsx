import React from 'react';
import { IoArrowBack } from 'react-icons/io5';

function StepHeader(props) {
  const { handleClick = () => {}, classname = '' } = props;
  return (
    <div
      onClick={handleClick}
      className={`${classname} w-full px-4 py-2 flex justify-start items-center`}>
      <IoArrowBack size={25} color="#fff" />
    </div>
  );
}

export default StepHeader;
