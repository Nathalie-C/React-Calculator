export function memory(showNum, selectedBtnValue, memoryStore) {
  if (selectedBtnValue === "Memory Save") {
    memoryStore = Number(showNum);
  } else if (selectedBtnValue === "Memory Recall") {
    showNum = memoryStore;
  } else if (selectedBtnValue === "Memory Clear") {
    memoryStore = 0;
  } else if (selectedBtnValue === "Memory Addition") {
    memoryStore += Number(showNum);
  } else if (selectedBtnValue === "Memory Subtract") {
    memoryStore -= Number(showNum);
  }

  return { memoryStore: memoryStore, showNum: showNum };
}

export function bonus03(showNum, selectedBtnValue) {
  return;
}
