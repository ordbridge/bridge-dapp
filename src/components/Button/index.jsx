import PropTypes from "prop-types";
import React from "react";

const shapes = { round: "rounded-[28px]" };
const variants = {
  fill: {
    deep_purple_A200_19: "bg-deep_purple-A200_19",
    black_900_01: "bg-black-900_01 text-white-A700",
    gray_900: "bg-gray-900",
    deep_purple_A200_33: "bg-deep_purple-A200_33 text-white-A700",
  },
  outline: {
    deep_purple_A200_d3:
      "border-deep_purple-A200_d3 border-solid text-deep_purple-A100_cc",
    white_A700_19:
      "border bg-gradient  border border-solid border-white-A700_19 text-white-A700",
    purple_900: "border border-purple-900 border-solid text-white-A700",
    deep_purple_A200_a3: "border-deep_purple-A200_a3 !border-solid",
    deep_purple_A200_cc:
      "border !border-deep_purple-A200_cc border-solid text-white-A700",
    light_purple_A200_cc:
      "border-[1px] !border-[#794effa3] border-solid text-white-A700",
  },
};
const sizes = { xs: "p-1.5", sm: "p-[12px]", md: "p-5" };

const Button = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape = "",
  size = "",
  variant = "",
  color = "",
  ...restProps
}) => {
  return (
    <button
      className={`${className} ${(shape && shapes[shape]) || ""} ${
        (size && sizes[size]) || ""
      } ${(variant && variants[variant]?.[color]) || ""}`}
      {...restProps}
    >
      {!!leftIcon && leftIcon}
      {children}
      {!!rightIcon && rightIcon}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  shape: PropTypes.oneOf(["round"]),
  size: PropTypes.oneOf(["xs", "sm", "md"]),
  variant: PropTypes.oneOf(["fill", "outline"]),
  color: PropTypes.oneOf([
    "deep_purple_A200_19",
    "black_900_01",
    "gray_900",
    "deep_purple_A200_33",
    "deep_purple_A200_d3",
    "white_A700_19",
    "purple_900",
    "deep_purple_A200_a3",
    "deep_purple_A200_cc",
    "light_purple_A200_cc",
  ]),
};

export { Button };
