//
const fs = require("fs");
const message = fs.readFileSync("./message.txt", "utf-8");
const length = message.length;

const characterCounts = {};

for (let i = 0; i < length; i++) {
  const character = message[i];
  if (characterCounts[character]) {
    continue;
  }

  let counter = 0;

  for (let k = 0; k < length; k++) {
    if (message[k] === character) {
      counter++;
    }
  }

  characterCounts[character] = counter;
}

const nodes = [];
for (let character in characterCounts) {
  const frequency = characterCounts[character];
  nodes.push({ character, frequency });
}
nodes.sort((a, b) => a.frequency - b.frequency);
console.table(nodes);
// console.log(nodes)

while (nodes.length > 1) {
  nodes.sort((a, b) => a.frequency - b.frequency);
  const left = nodes.shift();
  const right = nodes.shift();
  const parent = {
    character: null,
    frequency: left.frequency + right.frequency,
    leftChild: left,
    rightChild: right,
  };
  nodes.push(parent);
}

const root = nodes[0];

const huffmanCodes = {};

function generateCodes(node, code) {
  if (node.character) {
    huffmanCodes[node.character] = code;
    return;
  }
  generateCodes(node.leftChild, code + "0");
  generateCodes(node.rightChild, code + "1");
}

generateCodes(root, "");
for (let character in huffmanCodes) {
  console.log(`Letter ${character} Huffman code: ${huffmanCodes[character]}`);
}
let currentCode = "";
let decodedMessage = "";
let freshmsg = "";
console.log(huffmanCodes);
for (let i = 0; i < length; i++) {
  currentCode = message[i];
  if (currentCode in huffmanCodes) {
    decodedMessage = huffmanCodes[currentCode];
    let foundKey = getKeyByValue(huffmanCodes, decodedMessage);
    console.log(currentCode);
    console.log(decodedMessage);
    console.log(foundKey);
    freshmsg += foundKey;

    currentCode = "";
  }
}
console.log(freshmsg);
fs.appendFileSync("./message.txt", " " + freshmsg + " ");

function getKeyByValue(object, value) {
  const entries = Object.entries(object);
  for (let [key, val] of entries) {
    if (val === value) {
      return key;
    }
  }
  return null; 
}
