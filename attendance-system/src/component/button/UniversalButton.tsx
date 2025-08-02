interface Props {
  text: string;
}

const UniversalButton = ({ text }: Props) => {
  return (
    <div
      className={`mt-8 flex items-center justify-center font-bold px-7 text-xs cursor-pointer w-fit border-n-1/10 border border-solid py-3 rounded-[16px] hover:bg-gradient-to-r from-linear-1 to-linear-2`}
    >
      {text}
    </div>
  );
};

export default UniversalButton;
