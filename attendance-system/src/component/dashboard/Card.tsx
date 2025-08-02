import UniversalButton from "../button/UniversalButton";

interface Props {
  title: string;
  status: string;
  statusColor: "red" | "green" | "yellow" | "gray";
  time: string;
  action: string;
  onAction: () => void;
  disabled: boolean;
  loading: boolean;
}

const statusColors = {
  red: "bg-[#211416] text-[#EA4343]",
  green: "bg-[#16211A] text-[#43EA5B]",
  yellow: "bg-[#212016] text-[#EAD743]",
  gray: "bg-[#1A1A1A] text-[#9CA3AF]",
};

const Card = ({
  title,
  status,
  statusColor = "red",
  time,
  action,
  onAction,
  disabled,
  loading,
}: Props) => {
  return (
    <div className="w-full border border-n-1/10 p-4 rounded-lg shadow-md bg-[#1E1E1E]">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">{title} Board</h1>
        <div
          className={`flex justify-center items-center p-1 rounded-md px-2 ${statusColors[statusColor]}`}
        >
          <p className="text-xs">{status}</p>
        </div>
      </div>

      <div className="flex flex-col mt-4">
        <div className="flex">
          <p className="text-white">
            {title === "Sign-In" ? "Sign-In Time:" : "Sign-Out Time:"}
          </p>
          <p className="text-n-2 ml-2">{time}</p>
        </div>

        <div className="flex mt-2">
          <p className="text-white">Status:</p>
          <p className="text-n-2 ml-2 capitalize">{status.toLowerCase()}</p>
        </div>
      </div>

      <div className="flex w-full justify-center items-center mt-4">
        <UniversalButton
          text={loading ? "Processing..." : action}
          onClick={onAction}
          disabled={disabled || loading}
          variant={title === "Sign-In" ? "primary" : "secondary"}
        />
      </div>
    </div>
  );
};

export default Card;
