import { useEffect, useState } from "react";
import "~/app/styles/index.css";

import WebLNProvider from "../../ln/webln";
import extractLightningData from "../batteries/index";

function BoostButton() {
  const [sats, setSats] = useState(0);
  const [sent, setSent] = useState(false);

  const [lnurl, setLnurl] = useState(false);

  useEffect(() => {
    const extract = async () => {
      const lnData = await extractLightningData();
      if (lnData) {
        setLnurl(lnData.address);
      }
    };

    extract();
  }, []);

  const sendSats = async () => {
    window.webln = new WebLNProvider();
    try {
      await window.webln.enable();
      try {
        const result = await window.webln.lnurl(lnurl);
        if (result) {
          setSats(result.route.total_amt);
          setSent(true);
        }
      } catch (e) {
        console.error(e);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return lnurl ? (
    <button
      onClick={sendSats}
      style={{
        position: "fixed",
        zIndex: 1000000000,
        bottom: 20,
        right: 20,
        padding: 10,
        border: "none",
        fontFamily: "monospace",
        fontSize: "1rem",
        boxShadow: "0 0 10px #0000004a",
        color: "white",
        backgroundColor: "orange",
        borderRadius: "0.25rem",
      }}
    >
      {sent ? `Sent ${sats}. Send more?` : `Boost Sats to ${lnurl}`}
    </button>
  ) : null;
}

export default BoostButton;
