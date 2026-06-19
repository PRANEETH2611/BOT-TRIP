import { Navigate, Outlet, useLocation } from "react-router-dom";

import { motion } from "framer-motion";

import { useAuth } from "../context/AuthContext";

import Loader from "./Loader";

export default function ProtectedRoute() {
  const {
    user,

    loading,
  } = useAuth();

  const location = useLocation();

  // checking saved login session

  if (loading) {
    return (
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        className="
        min-h-screen
        bg-[#FAF7F2]
        flex
        items-center
        justify-center
        "
      >
        <Loader fullScreen label="Opening your album" />
      </motion.div>
    );
  }

  // not logged in

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // logged in users

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.25,
      }}
    >
      <Outlet />
    </motion.div>
  );
}
