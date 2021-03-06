pragma solidity >=0.4.2;

contract TodoList {
    TodoItem[] public todoItems;
    uint256 public totalVotes;

    struct TodoItem {
        bytes32 value;
        uint256 votes;
        bool checked;
    }

    function makeVote(uint256 index) public returns (uint256 votes) {
        todoItems[index].votes++;
        totalVotes++;
        return todoItems[index].votes;
    }

    function check(uint256 index) public {
        if (todoItems[index].checked == true) {
            todoItems[index].checked = false;
        } else {
            todoItems[index].checked = true;
        }
    }

    function addTodoItem(bytes32 _value) public returns (bool success) {
        TodoItem memory todoItem;
        todoItem.value = _value;
        todoItem.checked = false;
        todoItems.push(todoItem);
        return true;
    }

    function getTodoItems()
        public
        view
        returns (
            bytes32[] memory,
            uint256[] memory,
            bool[] memory
        )
    {
        uint256 length = todoItems.length;

        bytes32[] memory values = new bytes32[](length);
        uint256[] memory voteItems = new uint256[](length);
        bool[] memory checked = new bool[](length);

        for (uint256 i = 0; i < length; i++) {
            values[i] = todoItems[i].value;
            voteItems[i] = todoItems[i].votes;
            checked[i] = todoItems[i].checked;
        }

        return (values, voteItems, checked);
    }

    function deleteTodoItem(uint256 index) public returns (bool success) {
        if (index >= todoItems.length) return false;
        todoItems[index] = todoItems[todoItems.length-1];
        delete todoItems[todoItems.length - 1];
        return true;
    }
}
