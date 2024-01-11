import React from "react";
import "../styles/App.css";
import { calculatorButtons } from "../globals/calculator-button-data";
import { memory } from "./functions";
import { useState } from "react";

function App() {
  // can't change storeNum, only use setStoreNum
  const [storeNum, setStoreNum] = useState(0);
  const [showNum, setShowNum] = useState(0);
  const [operator, setOperator] = useState(undefined);
  const [memoryStore, setMemoryStore] = useState(0);

  // import btn data to interface
  function importButtons() {
    let buttons = [];
    for (let i = 0; i < calculatorButtons.length; i++) {
      let calculatorButton = calculatorButtons[i];
      buttons.push(
        <button
          className={calculatorButton.className}
          type={calculatorButton.type}
          value={calculatorButton.value}
          key={`${i}-${calculatorButton.text}`}
          onClick={(e) => {
            onButtonClick(e, calculatorButton);
          }}
        >
          {calculatorButton.text}
        </button>
      );
    }
    return buttons;
  }

  function onButtonClick(e, buttonInfo) {
    console.log("in onButtonClick", buttonInfo);
    // show selected btn on screen
    let selectedBtnType = buttonInfo.type;
    let selectedBtnValue = buttonInfo.value;
    //
    if (selectedBtnType === "number" || selectedBtnType === "decimal") {
      if (storeNum === showNum) {
        // click after operator, showNum wil become new click.value
        setShowNum(selectedBtnValue);
      } else {
        // click after number
        let newNum = 0;
        if (selectedBtnType === "number") {
          newNum = showNum * 10 + selectedBtnValue;
          setShowNum(newNum);
        } else if (selectedBtnType === "decimal") {
          newNum = showNum + ".";
          setShowNum(newNum);
        }
        //number after click decimal
        if (typeof showNum === "string" && selectedBtnType === "number") {
          newNum = showNum + selectedBtnValue;
          setShowNum(newNum);
        }
      }
    } else if (
      selectedBtnType === "operator" &&
      selectedBtnValue !== "Percent" &&
      selectedBtnValue !== "Square Root"
    ) {
      let newOperator = selectedBtnValue;
      //if there isn't an operator,storeNum
      if (operator === undefined) {
        setStoreNum(Number(showNum));
        setShowNum(Number(showNum));
      } else if (operator !== undefined) {
        //if there is an operator already,do calculatin and store it in storeNum
        let calNum;
        if (operator === "Add") {
          calNum = storeNum + Number(showNum);
        } else if (operator === "Subtract") {
          calNum = storeNum - Number(showNum);
        } else if (operator === "Divide") {
          calNum = storeNum / Number(showNum);
        } else if (operator === "Multiply") {
          calNum = storeNum * Number(showNum);
        }

        setShowNum(calNum);
        setStoreNum(calNum);
      }

      setOperator(newOperator);
    } else if (selectedBtnValue === "Percent") {
      //percent
      let percentCalNum;
      percentCalNum = Number(showNum) / 100;
      setShowNum(percentCalNum);
    } else if (selectedBtnValue === "Square Root") {
      //square root, showNum can't be negative number
      let squareRootCalNum;
      if (Number(showNum) >= 0) {
        squareRootCalNum = Math.sqrt(Number(showNum));
        setShowNum(squareRootCalNum);
      } else {
        alert("Invalid format used!");
      }
    } else if (selectedBtnType === "enter") {
      // click "Equal"
      let equalCalResult;
      if (operator === "Add") {
        equalCalResult = storeNum + Number(showNum);
      } else if (operator === "Subtract") {
        equalCalResult = storeNum - Number(showNum);
      } else if (operator === "Divide") {
        equalCalResult = storeNum / Number(showNum);
      } else if (operator === "Multiply") {
        equalCalResult = storeNum * Number(showNum);
      }
      setShowNum(equalCalResult);
      setOperator(undefined);
    } else if (selectedBtnType === "memory") {
      //Memory keys
      let ret = memory(showNum, selectedBtnValue, memoryStore);
      setShowNum(ret.showNum);
      setMemoryStore(ret.memoryStore);
    } else if (selectedBtnType === "sign") {
      setShowNum(-Number(showNum));
    }

    // AC & C btns
    if (buttonInfo.text === "AC") {
      setShowNum(0);
      setStoreNum(0);
      setOperator(undefined);
    } else if (buttonInfo.text === "C") {
      // clear showNum
      setShowNum(0);
    }
  }

  function calculateShowText() {
    return showNum;
  }
  console.log("storeNum: ", storeNum);
  console.log("calculateShowText: ", calculateShowText());
  console.log("Operator: ", operator);
  console.log("memoryStore: ", memoryStore);
  console.log("typeof :", typeof showNum);

  return (
    <div className="wrapper">
      <h1>Nate's Calculator</h1>
      <div className="cal-border">
        <div className="resultBar">
          <h2>{calculateShowText()}</h2>
        </div>
        {/* {importButtons()} when u want to call the function right now */}
        <div className="calculator">{importButtons()}</div>
      </div>
    </div>
  );
}

export default App;
