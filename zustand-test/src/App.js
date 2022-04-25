import create from "zustand";

const useCustomer = create((set) => ({
  first: "",
  last: "",
  job: "",
  setFirst: (first) => set(() => ({ first })),
  setLast: (last) => set(() => ({ last })),
  setJob: (job) => set(() => ({ job })),
}));

const connection = window.__REDUX_DEVTOOLS_EXTENSION__?.connect({
  name: "Form fields",
});
connection?.init(useCustomer.getState());

let isUpdateFromDevtools = false;
connection?.subscribe((evt) => {
  if (evt.type === "DISPATCH") {
    const newState = JSON.parse(evt.state);
    isUpdateFromDevtools = true;
    useCustomer.setState(newState);
    isUpdateFromDevtools = false;
  }
});

useCustomer.subscribe((newState) => {
  if (!isUpdateFromDevtools) {
    connection?.send("State", newState);
  }
});

function App() {
  const { first, last, job, setFirst, setLast, setJob } = useCustomer();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 3fr",
        gap: "1rem",
        width: 400,
      }}
    >
      <div>First</div>
      <input
        type="text"
        value={first}
        onChange={(evt) => setFirst(evt.target.value)}
      />
      <div>Last</div>
      <input
        type="text"
        value={last}
        onChange={(evt) => setLast(evt.target.value)}
      />
      <div>Job</div>
      <input
        type="text"
        value={job}
        onChange={(evt) => setJob(evt.target.value)}
      />
    </div>
  );
}

export default App;
