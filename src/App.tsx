import React, { useRef, useState, useCallback } from "react";
import { produce, Immutable, Draft } from "immer";
import logo from "./logo.svg";
import "./App.css";
type DataArrayObject = {
  id: number;
  name: string;
  username: string;
};
type DataArray = DataArrayObject[];
type Data = {
  array: DataArray;
  uselessValue: null | string;
};
type Form = Immutable<{ name: string; userName: string }>;
function App() {
  const nextId = useRef(1);
  const formInit: Form = { name: "", userName: "" };
  const [form, setForm] = useState(formInit);
  const dataInit: Data = {
    array: [],
    uselessValue: null,
  };
  const [data, setData] = useState(dataInit);

  const onChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setForm(
        produce(
          form,
          (
            draft: Draft<{
              [key: string]: string;
            }>
          ) => {
            draft[name] = value;
          }
        )
      );
    },
    [form]
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const info: DataArrayObject = {
        id: nextId.current,
        name: form.name,
        username: form.userName,
      };
      // setData({
      //   ...data,
      //   array: data.array.concat(info),
      // });
      setData(
        produce(data, (draft) => {
          draft.array.push(info);
        })
      );
      setForm({
        name: "",
        userName: "",
      });
      nextId.current += 1;
    },
    [data, form.name, form.userName]
  );
  const onRemove = useCallback(
    (id) => {
      setData(
        //   {
        //   ...data,
        //   array: data.array.filter((info) => info.id !== id),
        // }
        produce(data, (draft) => {
          draft.array.filter((info) => info.id !== id);
        })
      );
    },
    [data]
  );

  return (
    <div className="App">
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="userName"
          placeholder="아이디"
          value={form.userName}
          onChange={onChange}
        />
        <input
          type="text"
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={onChange}
        />
        <button type="submit">등록</button>
      </form>
      <div>
        <ul>
          {data.array.map((info) => (
            <li key={info.id} onClick={() => onRemove(info.id)}>
              {info.username}({info.name})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
