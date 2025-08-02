import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center w-full h-[4rem] border-b border-solid border-n-1/10 px-4  lg:px-8">
      <span className="bg-gradient-to-r from-linear-1  to-linear-2  font-black text-[transparent] bg-clip-text">
        {" "}
        Attendy
      </span>
    </div>
  );
};

export default Header;
