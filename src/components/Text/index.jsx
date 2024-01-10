import React from "react";

const sizeClasses = {
  txtSyneBold20: "font-bold font-syne",
  txtSyneBold64: "font-bold font-syne",
  txtPlusJakartaSansRomanBold36: "font-bold font-plusjakartasans",
  txtSyneSemiBold18: "font-semibold font-syne",
  txtSyneMedium24: "font-medium font-syne",
  txtSyneMedium36: "font-medium font-syne",
  txtSyneMedium32WhiteA700: "font-medium font-syne",
  txtSyneSemiBold48: "font-semibold font-syne",
  txtSyneMedium16: "font-medium font-syne",
  txtSyneMedium32: "font-medium font-syne",
  txtSyneRegular24: "font-normal font-syne",
  txtSyneBold40: "font-bold font-syne",
  txtSyneRegular135: "font-normal font-syne",
  txtPlusJakartaSansRomanBold2606: "font-bold font-plusjakartasans",
  txtSyneSemiBold24WhiteA700b2: "font-semibold font-syne",
  txtSyneSemiBold432: "font-semibold font-syne",
  txtSyneMedium144: "font-medium font-syne",
  txtSyneBold40DeeppurpleA200: "font-bold font-syne",
  txtSyneRegular1215: "font-normal font-syne",
  txtSyneSemiBold24: "font-semibold font-syne",
  txtSyneSemiBold162: "font-semibold font-syne",
  txtSyneMedium18: "font-medium font-syne",
};

const Text = ({ children, className = "", size, as, ...restProps }) => {
  const Component = as || "p";

  return (
    <Component
      className={`text-left ${className} ${size && sizeClasses[size]}`}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export default Text;
