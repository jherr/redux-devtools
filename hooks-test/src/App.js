import { useState, useEffect, useRef, useCallback } from "react";

const useMonitoredState = (initialValue) => {
  const [value, realSetValue] = useState(initialValue);

  const connection = useRef();
  const eventFromDevtools = useRef(false);

  const setValue = useCallback((_value) => {
    realSetValue(_value);
    if (!eventFromDevtools.current) {
      connection.current?.send("Value", _value);
    }
  }, []);

  useEffect(() => {
    connection.current = window.__REDUX_DEVTOOLS_EXTENSION__?.connect({
      name: "Monitored State",
    });

    connection.current?.subscribe((evt) => {
      if (evt.type === "DISPATCH") {
        const value = JSON.parse(evt.state);
        eventFromDevtools.current = true;
        setValue(value);
        eventFromDevtools.current = false;
      }
    });

    connection.current?.init("");
  }, []);

  return [value, setValue];
};

function App() {
  const [name, setName] = useMonitoredState("");
  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(evt) => setName(evt.target.value)}
      />
      <span>{name}</span>
    </div>
  );
}

export default App;
