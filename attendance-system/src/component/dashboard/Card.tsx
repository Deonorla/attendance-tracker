import UniversalButton from "../button/UniversalButton";

interface Props {
  title: string;
}

const Card = () => {
  return (
    <div className=" w-full border-n-2 border-solid border p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between ">
        <h1 className="text-xl font-semibold text-n-1">Sign-In Board </h1>
        <div className="flex justify-center items-center bg-[#211416] p-1 rounded-md px-2">
          <p className="text-[.7rem] text-[#EA4343]">Not signed in</p>
        </div>
      </div>
      <div className="flex flex-col mt-4">
        <div className="flex ">
          <p className="text-n-1 ">Resume Time:</p>
          <p className="text-n-2 ml-2">09:00 AM</p>
        </div>
        <div className="flex mt-2">
          <p className="text-n-1 ">Time Signed In:</p>
          <p className="text-n-2 ml-2">none</p>
        </div>
      </div>
      <div className="flex w-full justify-center items-center mt-4">
        <UniversalButton text="Sign In" />
      </div>
    </div>
  );
};

export default Card;
