pragma solidity >=0.4.2;

contract TodoList {
    TodoItem[] public todoItems;
    uint256 public totalVotes;

    struct TodoItem {
        bytes32 value;
        bool active;
        uint256 votes;
        bool checked;
    }

    function makeVote(uint256 index) public returns (uint256 percents) {
        todoItems[index].votes++;
        totalVotes++;
        return todoItems[index].votes / totalVotes;
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
        todoItem.active = false;
        todoItem.checked = false;
        todoItems.push(todoItem);
        return true;
    }

    function getTodoItems()
        public
        view
        returns (
            bytes32[] memory,
            bool[] memory,
            uint256[] memory,
            bool[] memory
        )
    {
        uint256 length = todoItems.length;

        bytes32[] memory values = new bytes32[](length);
        bool[] memory actives = new bool[](length);
        uint256[] memory voteItems = new uint256[](length);
        bool[] memory checked = new bool[](length);

        for (uint256 i = 0; i < length; i++) {
            values[i] = todoItems[i].value;
            actives[i] = todoItems[i].active;
            voteItems[i] = todoItems[i].votes;
            checked[i] = todoItems[i].checked;
        }

        return (values, actives, voteItems, checked);
    }

    function deleteTodoItem(uint256 index) public returns (bool success) {
        if (index >= todoItems.length) return false;

        for (uint256 i = index; i < todoItems.length - 1; i++) {
            todoItems[i] = todoItems[i + 1];
        }

        delete todoItems[todoItems.length - 1];
        return true;
    }
}
