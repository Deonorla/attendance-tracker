import Card from "../component/dashboard/Card";
import Header from "../component/Header/Header";

const Dashboard = () => {
  const now = new Date();
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = now.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="flex flex-col w-full h-screen">
      <Header />

      <div className="mx-4 sm:mx-8 mt-8 flex flex-col mb-4">
        <h2 className="text-white text-xl lg:text-2xl font-bold mt-4">
          Dashboard
        </h2>
        <p className=" mt-2 text-sm text-n-2  mb-6 lg:mb-8">
          {`${dayName}, ${date}`}
        </p>
        <div className="flex flex-col mt-8 lg:mt-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card />
            <Card />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
