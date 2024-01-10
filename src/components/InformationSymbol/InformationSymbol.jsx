import { useState } from 'react';
import { GrCircleInformation } from 'react-icons/gr';
import './InformationSymbol.css';

function InformationSymbol(props) {
  const { infoDesc, color = '#ffffff' } = props;
  const [showPopUp, setShowPopUp] = useState(false);

  const handleClick = () => {
    setShowPopUp(!showPopUp);
  };

  return (
    <div className="relative">
      <div
        className="icon_container cursor-pointer"
        onMouseEnter={() => {
          setShowPopUp(true);
        }}
        onMouseLeave={() => {
          setShowPopUp(false);
        }}
        onClick={handleClick}>
        <GrCircleInformation color={color} size={20} />
      </div>
      {showPopUp && (
        <div className="information_popup w-[200px] p-2 rounded-lg text-[#fff] font-semibold absolute -top-[50%] left-[120%]">
          <p className="text-sm">{infoDesc}</p>
        </div>
      )}
    </div>
  );
}

export default InformationSymbol;
