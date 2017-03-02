
/**
 * @author GJS <1353990812@qq.com>
 *
 * GJS reserves all rights not expressly granted.
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 GJS
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * 
 */
 
import { combineReducers } from 'redux'
import * as allReducers from './reducerIndex'

/*
 * reducer 写法参考
 *
 * 文件命名：WorkHomeReducer.js

import ActionConstants from '../constants/ActionConstants';


const defaultTodos = [
					{text: '写代码'},
					{text: '哄妹纸'},
					{text: '做饭洗碗家务事'},
					{text: '等等...'}
				];

const appendTodo = (state, action) => {
  var todos = Object.assign({}, state.todos)
  todos.push(action.todo);
  return {
	...state,
	todos,
	isLoadingTodos: action.isLoading,
  }
}

const appendTodos = (state, action) => {
  var todos = Object.assign({}, state.todos)
  todos.concat(action.todos);
  return {
	...state,
	todos,
	isLoadingTodos: action.isLoading,
  }
}

var workHomeState = function(state, action) {

	state = state || {
		type: ActionConstants.INITIAL_TODOS,
		todos: [],
		isLoadingTodos: false,
	}

	var todos = Object.assign({}, state.todos)

	switch(action.type) {

		case ActionConstants.LOAD_DEFAULT_TODOS: {
			todos = defaultTodos;
			return {
				...state,
				todos,
			}
		}

		case ActionConstants.TODO_APPEND_TODO: {
			return appendTodo(state, action);
		}
		
		case ActionConstants.TODO_APPEND_TODOS: {
			return appendTodos(state, action);
		}
		
		case ActionConstants.TODO_REFRESH: {
			if (action.todos) {
				todos = action.todos;
			};
			
			return {
				...state,
				todos,
				isLoadingTodos: action.isLoading,
			}
		}
		
		case ActionConstants.TODO_LOADING: {			
			return {
				...state,
				todos,
				isLoadingTodos: action.isLoading,
			}
		}

		case ActionConstants.TODO_CREATE: {
			todos.unshift(action.todo);
			return {
				...state,
				todos,
			}
		}

		case ActionConstants.TODO_COMPLETE: {
			var selected = action.selected;
			var index = todos.indexOf(selected);

			if(todos[index].selected) {
				todos[index] = { text: todos[index].text }
			}else {
				todos[index] = { text: todos[index].text, selected: true }
			}

			return {
				...state,
				todos,
			}
		}

		default: return {
			...state
		}

	}
}

function visibilityFilter(state = 'SHOW_ALL', action) {
  switch (action.type) {
    case ActionConstants.SET_VISIBILITY_FILTER:
      return action.filter
    default:
      return state
  }
}

module.exports = {workHomeState, visibilityFilter};
*/

/* reducer 导出写法
var assign = require('object-assign');
var reducer2 = require('./MySettingsReducer');
var FlowCenter = require('./FlowCenterReducer');//流程中心

var reducers = assign({},
    reducer2,
    MeetingList,
    FlowCenter,
    Login,
    CaseReportReducer,
    NoticeReducer,
    SignInItem,
    MeetingOrder,
    SeniorWeeklyListState,
);

module.exports = reducers;
*/

var assign = require('object-assign');

var reducers = assign({},
    allReducers,
);

module.exports = reducers;


// -- arr.concat(arr2)

// var reducers = workHome.concat(reducer2);
// module.exports = reducers;

// const finalReducer = combineReducers({
//   workHome,
//   reducer2
// })

// export default finalReducer
