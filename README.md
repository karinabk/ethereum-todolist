# DApp Todo-list project

![https://github.com/karinabk/ethereum-todolist/blob/master/ezgif.com-optimize_(1).gif](https://github.com/karinabk/ethereum-todolist/blob/master/ezgif.com-optimize_(1).gif)

# How it works 🔎

This Todo list allows you to:

1. Add new tasks
2. Track their completeness using checkboxes
3. Delete tasks which are not needed
4. Vote for the task that should be prioritized

### Adding and deleting the task

Tasks are managed in the smart contracts in the form of the `struct`. Parameters of the **`TodoItem` *include the* `value` **of the task, which is taken for the user's input; a number of `votes`, and boolean *checked* value for tracking completeness.

```jsx
struct TodoItem {
	bytes32 value;
  uint256 votes;
	bool checked;
}
```

New tasks are added to the array.

Deleting the task is done by rewriting the given `TodoItem` by the last object. Then last address of the array is freed.

### Task voting

To validate every vote and make sure that no user signed more than once, every vote is validated using Ethereum signature. To vote user needs to sign a message "I vote for this task!". This feature was built using ether.js library.

```jsx
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const signature = await signer.signMessage("I vote for this todo task!");
```

## Stack of technologies used

**Truffle** was used as the main framework to work with Ethereum Blockchains, to test and deploy smart contracts

**Ganache** was used for local blockchain network. On the local network, I deployed and tested smart contracts without any cost. 

**React.js** was used as a main frontend framework.
