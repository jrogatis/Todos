// JavaScript Document
/*jshint esversion:6 */



const todo = (state, action) => {

    switch (action.type) {
    case 'ADD_TODO':
        return {
            id: action.id,
            text: action.text,
            completed: false
        };
    case 'TOGGLE_TODO':
        if (state.id !== action.id) {
            return state;
        }

        return {
            ...state,
            completed: !state.completed
        };
    default:
        return state;
    }

};

//thaths the reducer
const todos = (state = [], action) => {

    switch (action.type) {
    case 'ADD_TODO':
        return [
				//isto e bem legal... tras todo objeto e 
				//apenas sobrepoe o que foi destacado!
				...state,
				todo(undefined, action)
				];
    case 'TOGGLE_TODO':
        //retira cada todo dos todos...
        return state.map(t =>
            todo(t, action)
        );

    default:
        return state;
    }
};

const visibilityFilter = (
    state = 'SHOW_ALL',
    action
) => {
    switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
        return action.filter;
    default:
        return state;
    }
};

//aqui junta os dois reducers o todos e o visibilityFilter
// juntando os dois objetos em um so...
//porem mantendo ambos no root do objeto... 
const {combineReducers} = Redux;
const todoApp = combineReducers({
    todos,
    visibilityFilter
});
//Action Containers !!!!

let nextTodoId = 0;
const addTodo = (text) =>{
	return {
		type: 'ADD_TODO',
		id: nextTodoId++,
		text
	};
};


const setVisibilityFilter = (filter) => {
	return {
			type: 'SET_VISIBILITY_FILTER',
			filter
	};
};

const toggleTodo = (id) => {
	return {		
		type: 'TOGGLE_TODO',
		id					
	}
	
}

const { Component} = React;
const { Provider, connect } = ReactRedux;



//  a perte interessante e como ele lida com os chields....
// ele nao deixa o default que ir para o link acontenter e inves d\
//dito chama o dispatch
// no diapach como o nome da propriedade e o campo tem o mesmo no no filter so 
// especifica o filter

const Link = ({
  	active,
    children,
	onClick
}) => {
    if (active) {
        return <span > {children} < /span>;
    }
    return ( 
		<a href = '#'
			onClick = {e => {
					e.preventDefault();
					onClick();
				}} 
		>
        {children} 
	  </a>
    );
};

const mapStateToLinkProps = (
	state,
	ownProps
) => {
	return {
	active: 
		ownProps.filter ===
		state.visibilityFilter
	};
	
};


const mapDispatchToLinkProps = (
	dispatch,
	ownProps
) => {
	return {
		onClick: () =>{ 
				dispatch(
					setVisibilityFilter(ownProps.filter)
				);
					  }
	};
	
};

const FilterLink = connect(
	mapStateToLinkProps,
	mapDispatchToLinkProps
	
)(Link);


FilterLink.contextTypes = {
	store: React.PropTypes.object
};

const Footer = () => (
		<p>
			Show: 
			{' '} 
			<FilterLink 
				filter = 'SHOW_ALL'

			>
				All 
			</FilterLink> 
			{' '}
			<FilterLink 
				filter = 'SHOW_ACTIVE'
				
			>
				Active 
			</FilterLink> {' '} 
			< FilterLink 
				filter = 'SHOW_COMPLETED'
				
			>
				Completed 
			</FilterLink> 
		</p>
);

//este e um compoente de apresentacao e nao precisa extender o react 
//para ele porque ele vai ser chamado por um que ja é  
const Todo = ({
    onClick,
    completed,
    text
}) => ( 
	<li 
		onClick = {onClick}
    	style = {{
            textDecoration: completed ?
                'line-through' : 'none'
        }} 
	> 
		{text} 
	</li>

)

const TodoList = ({
    todos,
    onTodoClick
}) => ( 
	<ul> {
        todos.map(todo =>
            <Todo 
				key = {todo.id}
	   			{...todo}
            	onClick = {
                	() => onTodoClick(todo.id)
            	}
            />
        	)
    	} 
	</ul>

);



let AddTodo = ({ dispatch }) => {
		let input;
	
		return (
			<div>
				<input ref = {node => {
						input = node;
				}}/> 
				<button onClick = {() => {
					dispatch(addTodo(input.value));
						input.value = '';
				}}>
					Add todo 
				</button>
			</div>			
		);

	};
//se vc usar o null como segundo argumento do connect ele vai 
//conectar o dispach do componente a ser conectado. e melhor
// ainda o comportamento default e null e null que conecta 
//direto o dispacth...

AddTodo = connect()(AddTodo);


const getVisibleTodos = (
    todos,
    filter
) => {

    switch (filter) {
    case 'SHOW_ALL':
        if (todos === undefined) {
            return [];
        }
        return todos;
    case 'SHOW_COMPLETED':
        return todos.filter(
            t => t.completed
        );
    case 'SHOW_ACTIVE':
        return todos.filter(
            t => !t.completed
        );
    }
};


const MapStateToTodoListProps = (
	state
) => {
	return {
	todos: getVisibleTodos(
					state.todos,
					state.visibilityFilter
				)
	};	
};
const MapStateDispatchToTodoListProps = (
	dispatch
) => {
	return {
		onTodoClick: (id) =>
					dispatch(toggleTodo(id))
	};	
}; 
const VisibleTodoList = connect (
	MapStateToTodoListProps,
	MapStateDispatchToTodoListProps,	
)(TodoList);


const TodoApp =() =>  (  
		<div>
			<AddTodo /> 
			<VisibleTodoList  /> 
			<Footer  />					
		</div>
);
    



const { createStore } = Redux;


ReactDOM.render(
	<Provider store = {createStore(todoApp)}>
		<TodoApp />
	</Provider>,
  document.getElementById('root'));


