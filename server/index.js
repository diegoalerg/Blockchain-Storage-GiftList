const express = require("express");
const verifyProof = require("../utils/verifyProof");
const niceList = require("../utils/niceList.json");
const MerkleTree = require("../utils/MerkleTree");

const port = 1225;

const app = express();
app.use(express.json());

// TODO: hardcode a merkle root here representing the whole nice list
// create the merkle tree for the whole nice list
const merkleTree = new MerkleTree(niceList);

// get the root
const root = merkleTree.getRoot();

const MERKLE_ROOT = root;

app.post("/gift", (req, res) => {
  // grab the parameters from the front-end here
  const { name } = req.body;
  // find the proof that norman block is in the list
  const index = niceList.findIndex((n) => n === name);
  const proof = merkleTree.getProof(index);

  // verify proof against the Merkle Root
  console.log(verifyProof(proof, name, root));

  // TODO: prove that a name is in the list

  if (verifyProof(proof, name, root)) {
    res.send("You got a toy robot!");
  } else {
    res.send("You are no on the list :(");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
