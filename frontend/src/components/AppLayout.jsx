import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div
      className="
      min-h-screen
      bg-[#FAF7F2]
      relative
      overflow-x-hidden
      "
    >
      {/* soft background decorations */}

      <div
        className="
        pointer-events-none
        fixed
        inset-0
        -z-10
        overflow-hidden
        "
      >
        <div
          className="
          absolute
          -top-32
          -left-32
          h-96
          w-96
          rounded-full
          bg-orange-200/40
          blur-3xl
          "
        />

        <div
          className="
          absolute
          top-1/3
          -right-32
          h-96
          w-96
          rounded-full
          bg-pink-200/40
          blur-3xl
          "
        />

        <div
          className="
          absolute
          bottom-0
          left-1/3
          h-80
          w-80
          rounded-full
          bg-blue-200/30
          blur-3xl
          "
        />
      </div>

      <Navbar />

      <main
        className="
        mx-auto
        max-w-[1600px]
        px-4
        py-6

        sm:px-6
        sm:py-8

        lg:px-10
        "
      >
        <Outlet />
      </main>
    </div>
  );
}
