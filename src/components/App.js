import React from "react";
import "../styles/App.css";
import "../styles/fonts.css";
import { calculatorButtons } from "../globals/calculator-button-data";
import { memory, doubleDecimalCheck } from "./functions";
import { useState } from "react";

function App() {
  // can't change storeNum, only use setStoreNum
  const [storeNum, setStoreNum] = useState(0);
  const [showNum, setShowNum] = useState(0);
  const [operator, setOperator] = useState(undefined);
  const [memoryStore, setMemoryStore] = useState(0);
  const [operatorClickedLastTime, setOperatorClickedLastTime] = useState(false);

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

    if (
      // click operator
      selectedBtnType === "operator" &&
      selectedBtnValue !== "Percent" &&
      selectedBtnValue !== "Square Root"
    ) {
      setOperatorClickedLastTime(true);
    } else {
      setOperatorClickedLastTime(false);
    }

    if (selectedBtnType === "number" || selectedBtnType === "decimal") {
      if (operatorClickedLastTime === true) {
        // click after operator, showNum will become new click.value
        setShowNum(selectedBtnValue);
      } else {
        // click after number
        let newNum = 0;
        // convert to string, count digits
        let digit = String(showNum).length;
        if (digit >= 14) {
          alert("Can't enter more than 14 digits!");
          newNum = showNum;
        } else {
          if (selectedBtnType === "number") {
            if (showNum === 0) {
              newNum = selectedBtnValue;
            } else {
              newNum = String(showNum) + selectedBtnValue;
            }
          } else if (selectedBtnType === "decimal") {
            // forbid multiple decimal click
            let hadDecimal = doubleDecimalCheck(showNum);
            if (hadDecimal === true) {
              newNum = showNum;
            } else if (showNum === 0) {
              newNum = "0.";
            } else {
              //become a string
              newNum = showNum + ".";
            }
          }
        }
        setShowNum(newNum);
      }
    } else if (
      // click operator
      selectedBtnType === "operator" &&
      selectedBtnValue !== "Percent" &&
      selectedBtnValue !== "Square Root"
    ) {
      let newOperator;
      if (operatorClickedLastTime === true) {
        newOperator = selectedBtnValue;
      } else {
        if (
          showNum === 0 &&
          operator === undefined &&
          storeNum === 0 &&
          memoryStore === 0
        ) {
          alert("Invalid format used! Please try again.");
          setStoreNum(0);
          setShowNum(0);
          newOperator = undefined;
        }
        //if there isn't an operator,storeNum
        else if (operator === undefined) {
          setStoreNum(Number(showNum));
          setShowNum(Number(showNum));
          newOperator = selectedBtnValue;
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
          newOperator = selectedBtnValue;
          setShowNum(calNum);
          setStoreNum(calNum);
        }
      }

      setOperator(newOperator);
    } else if (selectedBtnValue === "Percent") {
      //percent
      let percentCalNum;
      // convert to string, count digits
      let digit = String(showNum).length;
      if (digit >= 14) {
        alert("Can't have more than 14 digits!");
        percentCalNum = showNum;
      } else {
        if (
          showNum === 0 &&
          operator === undefined &&
          storeNum === 0 &&
          memoryStore === 0
        ) {
          alert("Invalid format used! Please try again.");
          percentCalNum = 0;
          setStoreNum(0);
          setOperator(undefined);
        } else {
          percentCalNum = Number(showNum) / 100;
        }
      }
      setShowNum(percentCalNum);
    } else if (selectedBtnValue === "Square Root") {
      //square root, showNum can't be negative number
      let squareRootCalNum;
      if (
        showNum === 0 &&
        operator === undefined &&
        storeNum === 0 &&
        memoryStore === 0
      ) {
        alert("Invalid format used! Please try again.");
        setShowNum(0);
        setStoreNum(0);
        setOperator(undefined);
      } else {
        if (Number(showNum) >= 0) {
          squareRootCalNum = Math.sqrt(Number(showNum));
          setShowNum(squareRootCalNum);
        } else {
          alert("Invalid format used!");
        }
      }
    } else if (selectedBtnType === "enter") {
      // click "Equal"
      let equalCalResult;
      if (
        showNum === 0 &&
        operator === undefined &&
        storeNum === 0 &&
        memoryStore === 0
      ) {
        equalCalResult = 0;
        setStoreNum(0);
      } else if (operator === undefined) {
        equalCalResult = showNum;
      } else {
        if (operator === "Add") {
          equalCalResult = storeNum + Number(showNum);
        } else if (operator === "Subtract") {
          equalCalResult = storeNum - Number(showNum);
        } else if (operator === "Divide") {
          equalCalResult = storeNum / Number(showNum);
        } else if (operator === "Multiply") {
          equalCalResult = storeNum * Number(showNum);
        }

        // error control
        if (
          equalCalResult === Infinity ||
          Number.isNaN(equalCalResult) === true
        ) {
          alert("Invalid format used! Please try again.");
          equalCalResult = 0;
          setStoreNum(0);
        }
      }

      setShowNum(equalCalResult);
      setOperator(undefined);
    } else if (selectedBtnType === "memory") {
      //Memory keys
      let ret = memory(showNum, selectedBtnValue, memoryStore);
      setShowNum(ret.showNum);
      setMemoryStore(ret.memoryStore);
    } else if (selectedBtnType === "sign") {
      if (showNum === 0) {
        setShowNum(0);
      } else {
        setShowNum(-Number(showNum));
      }
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
      <section>
        <h1>Nate Calculator</h1>
      </section>
      <section>
        <div className="cal-border">
          <div className="resultBar">
            <h2>{calculateShowText()}</h2>
          </div>
          {/* {importButtons()} when u want to call the function right now */}
          <div className="calculator">{importButtons()}</div>
        </div>
      </section>
      <section>
        <p className="copyright"> &#169; 2024 Nathalie Chang</p>
      </section>
    </div>
  );
}

export default App;
