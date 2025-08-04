interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: string;
}

const Button = ({ text, onClick, disabled }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 bg-n-1/20 hover:bg-n-1/10 text-white text-xs rounded-lg mb-4  cursor-pointer"
    >
      {text}
    </button>
  );
};

export default Button;
