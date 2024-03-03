import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import React, { useEffect, useState } from "react";

const EventListen = () => {
  const [data, setData] = useState(null);

  const listenIncMut = async () => {
    await listen("event_and_state_inc_mut", (event) => {
      setData(event);
    });
  };

  useEffect(() => {
    listenIncMut();
  }, []);

  return (
    <div>
      <h2>Listen for event</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>

      <button
        type="button"
        onClick={() => {
          invoke("event_and_state_inc_mut");
        }}
      >
        Call "event_and_state_inc_mut" to increment
      </button>
    </div>
  );
};

export default EventListen;
