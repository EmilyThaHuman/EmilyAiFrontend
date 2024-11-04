// import React, { createContext, useContext, useReducer } from 'react';

// const TreeContext = createContext();

// const initialState = {
//   items: [],
//   selectedId: null,
//   searchTerm: '',
//   loading: false,
//   error: null,
//   action: null,
//   newItemData: {
//     name: '',
//     type: '.txt',
//     content: '',
//     isDirectory: false,
//     isOpen: false,
//     metadata: {
//       space: '',
//     },
//   },
//   isUploading: false,
//   uploadProgress: 0,
// };

// function treeReducer(state, action) {
//   switch (action.type) {
//     case 'SET_ITEMS':
//       return { ...state, items: action.payload };
//     case 'ADD_ITEM':
//       return { ...state, items: addItemToTree(state.items, action.payload) };
//     case 'REMOVE_ITEM':
//       return {
//         ...state,
//         items: removeItemFromTree(state.items, action.payload),
//       };
//     case 'UPDATE_ITEM':
//       return {
//         ...state,
//         items: updateItemInTree(
//           state.items,
//           action.payload.id,
//           action.payload.updates
//         ),
//       };
//     case 'MOVE_ITEM':
//       return {
//         ...state,
//         items: moveItemInTree(
//           state.items,
//           action.payload.dragId,
//           action.payload.dropId,
//           action.payload.newPath
//         ),
//       };
//     case 'SET_SELECTED':
//       return { ...state, selectedId: action.payload };
//     case 'SET_SEARCH':
//       return { ...state, searchTerm: action.payload };
//     case 'SET_LOADING':
//       return { ...state, loading: action.payload };
//     case 'SET_ERROR':
//       return { ...state, error: action.payload };
//     case 'SET_ACTION':
//       return { ...state, action: action.payload };
//     case 'SET_NEW_ITEM_DATA':
//       return { ...state, newItemData: action.payload };
//     case 'SET_UPLOADING':
//       return { ...state, isUploading: action.payload };
//     case 'SET_UPLOAD_PROGRESS':
//       return { ...state, uploadProgress: action.payload };
//     default:
//       return state;
//   }
// }

// export function TreeProvider({ children }) {
//   const [state, dispatch] = useReducer(treeReducer, initialState);

//   return (
//     <TreeContext.Provider value={{ state, dispatch }}>
//       {children}
//     </TreeContext.Provider>
//   );
// }

// export function useTree() {
//   const context = useContext(TreeContext);
//   if (!context) {
//     throw new Error('useTree must be used within a TreeProvider');
//   }
//   return context;
// }

// export default TreeProvider;
