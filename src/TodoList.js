import React, { Component } from 'react';
import TodoListContract from '../build/contracts/TodoList.json';
import web3, {
  selectContractInstance, mapReponseToJSON, provider
} from './web3';
import "./styles.scss";

import { ethers } from "ethers";
import styled, { injectGlobal } from 'styled-components';




class TodoList extends Component {
  render() {
    return (
      <Container>
        <Header>
          <H1>Todo list </H1>
          <H2>Vote for the todo item you wanna be done first</H2>
        </Header>
        <TodoListContainer>
          <InputText
            value={this.state.newItem}
            placeholder="Type the task here :)"
            onChange={e => this.setState({ newItem: e.target.value })}
            onKeyDown={this.handleSubmit}
          />
          {this.state.todoItems.length >= 0 &&
            <List>

              {this.state.todoItems.map((item, itemIndex) =>
                item.value && (
                  <TodoItem key={itemIndex} input>
                    <input style={{color: '#504048'}} type="checkbox"  defaultChecked={item.checked}
                      onClick={() => this.handleCheckboxChange(itemIndex)}
                    />
                    <DestroyBtn onClick={() => this.deleteTodoItem(itemIndex)}>×</DestroyBtn>
                    <ItemLabel checked={item.checked}>{item.value}</ItemLabel>
                    {this.state.voted ? (
                      <Text>{`Votes: ${item.votes}`}</Text>
                    ) : (

                        <VoteBtn onClick={() => { this.castVote(itemIndex) }}>Vote</VoteBtn>
                      )}
                  </TodoItem>))}
            </List>
          }
        </TodoListContainer>
        <Address>Your account: {this.state.account}</Address>
      </Container>
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      todoItems: [],
      newItem: '',
      account: web3.eth.accounts[0],
      pending: false,
      calling: false,
      voted: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteTodoItem = this.deleteTodoItem.bind(this);
  }


  async castVote(position) {
    this.setState({ pending: true });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage("I vote for this todo task!");
    if (localStorage.getItem(signature)) {
      alert("You have already voted!")
      this.setState({voted: true})
    } else {
      this.setState({ voted: true });
      await this.todoList.makeVote(position, { from: this.state.account });
      localStorage.setItem(signature, signature)
      const todoItems = await this.getTodoItems();
      this.setState({ todoItems});
    }

  }

  async componentWillMount() {
    this.todoList = await selectContractInstance(TodoListContract);

    const todoItems = await this.getTodoItems();
    this.setState({ todoItems });
  }

  async handleCheckboxChange(position) {    
    await this.todoList.check(position, { from: this.state.account });
    const todoItems = await this.getTodoItems();
    this.setState({ todoItems});
  }

  async handleSubmit({ key }) {
    if (key !== 'Enter') return;

    this.setState({ pending: true });
    const todoList = await selectContractInstance(TodoListContract);
    await todoList.addTodoItem(this.state.newItem, { from: this.state.account });

    const todoItems = await this.getTodoItems();

    this.setState({ todoItems, newItem: ''});
  }

  async getTodoItems() {

    const todoItemsResp = await this.todoList.getTodoItems.call();
    const todoItems = mapReponseToJSON(
      todoItemsResp, ['value', 'votes','checked'], 'arrayOfObject'
    );
    return todoItems;
  }

  async deleteTodoItem(position) {
    this.setState({ pending: true });
    await this.todoList.deleteTodoItem(position, { from: this.state.account });
    const todoItems = await this.getTodoItems();

    this.setState({ todoItems});
  }
}

export default TodoList;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #eacfac;
  height: 100%;
  width: 100%;
  border-radius: 20 px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const H1 = styled.h1`
  color: #504048;
  font-size: 6rem;
  margin-bottom: auto;
`;

const H2 = styled.h2`
  color: #be6043;
  font-size: 2rem;
`;

const Text = styled.p`
  color: #be6043;
  display: inline-block;
  float: right;
  margin: 1%

`

const TodoListContainer = styled.section`
  background: #fbf5ee;
  position: relative;
  width: 70%;
  border-radius: 20px;

`;

const InputText = styled.input`
  padding: 1.5rem 1.5rem 1rem 2rem;
  border: none;
  background: rgba(0, 0, 0, 0.003);
  box-shadow: inset 0 -2px 1px rgba(0,0,0,0.03);
  width: 93%;
  border-radius: 20 px;
  color: #504048;
  position: relative;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;

  &:focus {
    outline: none;
  }
`;

const List = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  background-color: #eacfac;
`;

const TodoItem = styled.li`
  position: relative;
  font-size: 24px;
  border-bottom: 1px solid #ededed;
  background-color: #fbf5ee;
  border-radius: 20px;
  display: block;
  color: #504048;
  box-shadow: 0 1rem 2rem 0 rgba(0, 0, 0, 0.2), 0 4rem 6rem 0 rgba(0, 0, 0, 0.1);
  &:last-child {
    border-bottom: none;
  }
`;

const ItemLabel = styled.label`
  white-space: pre-line;
  word-break: break-all;
  padding: 15px 60px 15px 15px;
  margin-left: 45px;
  display: inline-block;
  line-height: 1.2;
  transition: color 0.4s;
  textDecoration: ${props => props.checked ? 'line-through' : 'none'};
`;

const Button = styled.button`
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  font-size: 100%;
  vertical-align: baseline;
  font-family: inherit;
  font-weight: inherit;
  color: #a9594b;
  appearance: none;
  font-smoothing: antialiased;
  outline: none;
  &:hover{
    color: #eacfac
  }
  &:active{
    color: #623122
  }
`;
const VoteBtn = styled(Button)`
position: absolute;
top: 0;
right: -0px;
bottom: 0;
width: 10%;
height: 40px;

margin: auto 0;
font-size: 30px;
margin-bottom: 11px;
transition: color 0.2s ease-out;
cursor: pointer;
`
const DestroyBtn = styled(Button)`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40px;
  height: 40px;
  margin: auto 0;
  font-size: 30px;#fbf5ee
  float:left;
  margin-bottom: 11px;
  transition: color 0.2s ease-out;
  cursor: pointer;
`;

const Address = styled.div`
  position: fixed;
  top: 2%;
  right: 0;
  color: #504048;;
`;


injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Roboto');

  body {
    background-color: whitesmoke;
    font-family: 'Roboto', sans-serif;
  }
`
