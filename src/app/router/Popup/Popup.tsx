import Navbar from "@components/Navbar";
import ConfirmPayment from "@screens/ConfirmPayment";
import Home from "@screens/Home";
import Keysend from "@screens/Keysend";
import LNURLPay from "@screens/LNURLPay";
import Receive from "@screens/Receive";
import Send from "@screens/Send";
import Unlock from "@screens/Unlock";
import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AccountsProvider } from "~/app/context/AccountsContext";
import { useAuth } from "~/app/context/AuthContext";
import { AuthProvider } from "~/app/context/AuthContext";
import { CurrencyProvider, useCurreny } from "~/app/context/CurrencyContext";

import RequireAuth from "../RequireAuth";

function Popup() {
  return (
    <AuthProvider>
      <AccountsProvider>
        <CurrencyProvider>
          <HashRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <Layout />
                  </RequireAuth>
                }
              >
                <Route index element={<Home />} />
                <Route path="send" element={<Send />} />
                <Route path="receive" element={<Receive />} />
                <Route path="lnurlPay" element={<LNURLPay />} />
                <Route path="keysend" element={<Keysend />} />
                <Route path="confirmPayment" element={<ConfirmPayment />} />
              </Route>
              <Route path="unlock" element={<Unlock />} />
            </Routes>
          </HashRouter>
        </CurrencyProvider>
      </AccountsProvider>
    </AuthProvider>
  );
}

const Layout = () => {
  const auth = useAuth();
  const { balances } = useCurreny();

  return (
    <div className="flex flex-col h-full">
      <Navbar
        title={
          typeof auth.account?.name === "string"
            ? `${auth.account?.name} - ${auth.account?.alias}`.substring(0, 21)
            : ""
        }
        subtitle={balances}
      />

      <main className="flex flex-col grow min-h-0">
        <Outlet />
        <ToastContainer />
      </main>
    </div>
  );
};

export default Popup;
