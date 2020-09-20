import React from "react";
import "./App.scss";

import DragNDrop from './components/DragElement'

type dataObjT = {
  title: string;
  items: Array<string>;
};

export type dataT = Array<dataObjT>;

const data: dataT = [
  { title: "Group 1", items: ["1", "2", "3", "4"] },
  { title: "Group 2", items: ["1", "2", "3", "4"] },
  { title: "Group 3", items: ["1", "2", "3", "4"] },
];

function App() {
  return (
    <div className="App">
      <header className="header">
        <DragNDrop data={data}/>
      </header>
    </div>
  );
}

export default App;
