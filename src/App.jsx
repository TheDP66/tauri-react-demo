import { invoke } from "@tauri-apps/api/tauri";
import { WebviewWindow, appWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
import "./App.css";
import EventListen from "./EventListen";
import reactLogo from "./assets/react.svg";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [customMsg, setCustomMsg] = useState("");
  const [name, setName] = useState("");
  const [decoration, setDecoration] = useState(true);
  const [ip, setIp] = useState("");
  const [label, setLabel] = useState("");

  async function greet(value) {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name: value }));

    setName(value);
  }

  async function customPayload() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setCustomMsg(await invoke("custom_payload", { payload: { nama: name } }));
  }

  const myIp = async () => {
    setIp(await invoke("my_ip"));
  };

  const windowLabel = async () => {
    setLabel(await invoke("window_label"));
  };

  useEffect(() => {
    customPayload();
    myIp();
    windowLabel();
  }, [name]);

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => greet(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
      </form>

      <p>{greetMsg}</p>

      <button type="button" onClick={() => invoke("open_overlay_window")}>
        Open overlay window!
      </button>

      <button
        type="button"
        onClick={() => {
          new WebviewWindow("no-buttons", {
            url: "no-buttons",
            decorations: true, // Top title
            transparent: true, // Rounded
          });

          setDecoration((prev) => !prev);
        }}
      >
        {!decoration ? "With decoration" : "No decoration"}
      </button>

      <button
        type="button"
        onClick={() => {
          appWindow.minimize();
        }}
      >
        Minimize window!
      </button>

      <button
        type="button"
        onClick={() => {
          appWindow.toggleMaximize();
        }}
      >
        Maximize window!
      </button>

      <button
        type="button"
        onClick={() => {
          appWindow.close();
        }}
      >
        Close window!
      </button>

      <p>Payload: {JSON.stringify(customMsg, null, 2)}</p>
      <p>{customMsg.nama}</p>

      <p>My IP is {ip}</p>

      <p>{label}</p>

      <EventListen />
    </div>
  );
}

export default App;
