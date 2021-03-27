const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const ppfListEl = document.getElementById("ppf-list");
const sbpListEl = document.getElementById("sbp-list");
const tltListEl = document.getElementById("tlt-list");
const jtListEl = document.getElementById("jt-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let ppfListArray = [];
let sbpListArray = [];
let tltListArray = [];
let jtListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("ppfItems")) {
    ppfListArray = JSON.parse(localStorage.ppfItems);
    sbpListArray = JSON.parse(localStorage.sbpItems);
    tltListArray = JSON.parse(localStorage.tltItems);
    jtListArray = JSON.parse(localStorage.jtItems);
  } else {
    ppfListArray = [
      "People thrive with good relationships.",
      "Kidness matters.",
    ];
    sbpListArray = [
      "We all have more power than we think to make positive change.",
    ];
    tltListArray = [
      "Talking and listening to each other.",
      "Getting stuff done.",
    ];
    jtListArray = ["Solving problems together."];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [ppfListArray, sbpListArray, tltListArray, jtListArray];
  const arrayNames = ["ppf", "sbp", "tlt", "jt"];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Items`,
      JSON.stringify(listArrays[index])
    );
  });
}

// Filter Array to remove empty values
function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.textContent = item;
  listEl.id = index;
  listEl.classList.add("drag-item");
  listEl.draggable = true;
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  // Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // ppf Column
  ppfListEl.textContent = "";
  ppfListArray.forEach((ppfItem, index) => {
    createItemEl(ppfListEl, 0, ppfItem, index);
  });
  ppfListArray = filterArray(ppfListArray);
  // sbp Column
  sbpListEl.textContent = "";
  sbpListArray.forEach((sbpItem, index) => {
    createItemEl(sbpListEl, 1, sbpItem, index);
  });
  sbpListArray = filterArray(sbpListArray);
  // tlt Column
  tltListEl.textContent = "";
  tltListArray.forEach((tltItem, index) => {
    createItemEl(tltListEl, 2, tltItem, index);
  });
  tltListArray = filterArray(tltListArray);
  // jt Column
  jtListEl.textContent = "";
  jtListArray.forEach((jtItem, index) => {
    createItemEl(jtListEl, 3, jtItem, index);
  });
  jtListArray = filterArray(jtListArray);
  // Don't run more than once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update Item - Delete if necessary, or update Array value
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumn = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumn[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumn[id].textContent;
    }
    updateDOM();
  }
}

// Add to Column List, Reset Textbox
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM(column);
}

// Show Add Item Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}

// Hide Item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}

// Allows arrays to reflect Drag and Drop items
function rebuildArrays() {
  ppfListArray = [];
  for (let i = 0; i < ppfListEl.children.length; i++) {
    ppfListArray.push(ppfListEl.children[i].textContent);
  }
  sbpListArray = [];
  for (let i = 0; i < sbpListEl.children.length; i++) {
    sbpListArray.push(sbpListEl.children[i].textContent);
  }
  tltListArray = [];
  for (let i = 0; i < tltListEl.children.length; i++) {
    tltListArray.push(tltListEl.children[i].textContent);
  }
  jtListArray = [];
  for (let i = 0; i < jtListEl.children.length; i++) {
    jtListArray.push(jtListEl.children[i].textContent);
  }
  updateDOM();
}

// When Item Enters Column Area
function dragEnter(column) {
  listColumns[column].classList.add("over");
  currentColumn = column;
}

// When Item Starts Dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

// Column Allows for Item to Drop
function allowDrop(e) {
  e.preventDefault();
}

// Dropping Item in Column
function drop(e) {
  e.preventDefault();
  const parent = listColumns[currentColumn];
  // Remove Background Color/Padding
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  // Add item to Column
  parent.appendChild(draggedItem);
  // Dragging complete
  dragging = false;
  rebuildArrays();
}

// On Load
updateDOM();
