import { useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import * as CryptoJS from "crypto-js";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);

  const [algorithm, setAlgorithm] = useState("AES");

  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");

  const [encKey, setEncKey] = useState("mhhabib");
  const [decKey, setDecKey] = useState("mhhabib");

  // ---------------- OTP ----------------
  const otpEncrypt = (text, key) => {
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const c = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(c);
    }
    return btoa(result);
  };

  const otpDecrypt = (text, key) => {
    const decoded = atob(text);
    let result = "";
    for (let i = 0; i < decoded.length; i++) {
      const c = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(c);
    }
    return result;
  };

  // ---------------- AES ----------------
  const aesEncrypt = (text, key) => {
    return CryptoJS.AES.encrypt(text, key).toString();
  };

  const aesDecrypt = (text, key) => {
    return CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
  };

  // ---------------- 3DES ----------------
  const desEncrypt = (text, key) => {
    return CryptoJS.TripleDES.encrypt(text, key).toString();
  };

  const desDecrypt = (text, key) => {
    return CryptoJS.TripleDES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
  };

  // ---------------- Handler ----------------
  const encrypt = () => {
    if (algorithm === "OTP") {
      setCipherText(otpEncrypt(plainText, encKey));
    } else if (algorithm === "AES") {
      setCipherText(aesEncrypt(plainText, encKey));
    } else if (algorithm === "3DES") {
      setCipherText(desEncrypt(plainText, encKey));
    }
  };

  const decrypt = () => {
    if (algorithm === "OTP") {
      setPlainText(otpDecrypt(cipherText, decKey));
    } else if (algorithm === "AES") {
      setPlainText(aesDecrypt(cipherText, decKey));
    } else if (algorithm === "3DES") {
      setPlainText(desDecrypt(cipherText, decKey));
    }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  const handleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser(decoded);
  };

  return (
    <div className="main-container">
      <h1 className="title">ASSIGNMENT II Extension</h1>

      {!user ? (
        <div className="auth-section">
          <p>Sign in using your Google Account</p>
          <GoogleLogin onSuccess={handleSuccess} />
        </div>
      ) : (
        <div className="tool-container">
          <div className="user-header">
            <span>
              Logged in as: <strong>{user.name}</strong>
            </span>
            <button
              onClick={() => {
                googleLogout();
                setUser(null);
              }}
            >
              Sign Out
            </button>
          </div>

          {/* LEFT SIDE ENCRYPT */}
          <div className="gui-layout">
            <div className="column">
              <h3>Message to Encrypt</h3>

              <textarea
                value={plainText}
                onChange={(e) => setPlainText(e.target.value)}
                placeholder="Enter text"
              />

              <div className="row">
                <label>Encryption Key</label>
                <input
                  value={encKey}
                  onChange={(e) => setEncKey(e.target.value)}
                />
              </div>

              <div className="button-row">
                <button onClick={encrypt}>Encrypt</button>
                <button onClick={() => copy(cipherText)}>Copy</button>
              </div>

              <textarea value={cipherText} readOnly />
            </div>

            {/* RIGHT SIDE DECRYPT */}
            <div className="column">
              <h3>Message to Decrypt</h3>

              <textarea
                value={cipherText}
                onChange={(e) => setCipherText(e.target.value)}
              />

              <div className="row">
                <label>Decryption Key</label>
                <input
                  value={decKey}
                  onChange={(e) => setDecKey(e.target.value)}
                />
              </div>

              <div className="button-row">
                <button onClick={decrypt}>Decrypt</button>
                <button onClick={() => copy(plainText)}>Copy</button>
              </div>

              <textarea value={plainText} readOnly />
            </div>
          </div>

          {/* Algorithm selector */}
          <div className="footer-row">
            <button
              onClick={() =>
                setAlgorithm((prev) =>
                  prev === "AES" ? "3DES" : prev === "3DES" ? "OTP" : "AES",
                )
              }
            >
              Choose Algorithm
            </button>

            <input value={algorithm} readOnly />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
