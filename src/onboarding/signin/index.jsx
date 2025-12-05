// import logo from "../../assets/logo.png";
import { Outlet } from "react-router-dom";

function Index() {
  return (
    <main
      className="h-screen overflow-hidden flex justify-center items-center relative bg-cover bg-center bg-no-repeat before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[rgba(52,71,103,0.6)] before:z-0"
      style={{
        backgroundImage: `url(${"https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"})`,
      }}
    >
      <section className="z-10 w-full md:w-1/3 flex justify-center items-center p-5">
        <Outlet />
      </section>
    </main>
  );
}

export default Index;
