import React, { useState, useEffect } from 'react';
import { v4 } from 'uuid';
import { randomColor } from 'randomcolor';
import Draggable from 'react-draggable';

function App() {
  // используем хуки, для хранение, отслеживания, и получения из localStorage наших задач
  const [item, setItem] = useState('');
  const [items, setItems] = useState(JSON.parse(localStorage.getItem('items')) || []);
  // хук для задания изначальной позиции задачи, и изменения позиции для последующих задач
  const [pos, setPos] = useState({ x: 100, y: -600 });

  // для отправки в localStorage наших задач, и следить для ререндера
  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  //тех переменная для Draggable, лечение  ошибки при рендере в strickMode
  const nodeRef = React.useRef(null);

  //Создание нашей задачи, с обьектом-настройками, id используем рандом-id, цвет и позицию для отображения, записываем в наш массив, изменяем начальные координаты и очищаем строчку, в противнум случае если item пустая строка то выкидываем alert
  const newItem = () => {
    if (item.trim() !== '') {
      const newItem = {
        id: v4(),
        item: item,
        //настройки из доку-ции randomColor
        color: randomColor({
          luminosity: 'light',
        }),
        defaultPos: pos,
      };

      setItems((items) => [...items, newItem]);
      setItem('');
      setPos(() => {
        return { x: pos.x + 5, y: pos.y + 65 };
      });
    } else {
      alert('Введите что-нибудь...');
      setItem('');
    }
  };

  //переменная для удаления задачи по id с помощью filter
  const deleteNote = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  //тех ф-ия из документации Draggable для сохранения позиции наших задач
  const updatePos = (data, index) => {
    let newArr = [...items];
    newArr[index].defaultPos = {
      x: data.x,
      y: data.y,
    };
    setItems(newArr);
  };

  // тех ф-ия для отслеживания события нажатие 'Enter' клавишей
  const keyPress = (e) => {
    const code = e.keyCode || e.which;
    if (code === 13) {
      newItem();
    }
  };

  return (
    <div className="App">
      <div className="wrapper">
        <input
          value={item}
          onChange={(e) => setItem(e.target.value)}
          onKeyPress={(e) => keyPress(e)}
          type="text"
          placeholder="Дела на сегодня ..."></input>
        <button onClick={newItem}>Enter</button>
      </div>

      {/* мепим наш массив с задачами, и рендерем компонент-оболочку Draggble с описанием */}
      {items.map((item, index) => (
        <Draggable
          nodeRef={nodeRef}
          key={index}
          defaultPosition={item.defaultPos}
          onStop={(_, data) => {
            updatePos(data, index);
          }}
          onStart={(_, data) => {
            updatePos(data, index);
          }}>
          <div className="todo__item" ref={nodeRef} style={{ backgroundColor: item.color }}>
            {`${item.item}`}
            <button onClick={() => deleteNote(item.id)} className="todo__remove">
              X
            </button>
          </div>
        </Draggable>
      ))}
    </div>
  );
}

export default App;

// исправать dragStart ошибку
