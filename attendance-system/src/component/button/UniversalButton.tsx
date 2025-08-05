interface Props {
  text: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: string;
}

const UniversalButton = ({ text, onClick, disabled, className }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center ${className} justify-center font-bold px-7 text-xs cursor-pointer w-fit border-n-1/10 border border-solid py-3 rounded-[16px] hover:bg-gradient-to-r from-linear-1 to-linear-2`}
    >
      {text}
    </button>
  );
};

export default UniversalButton;
