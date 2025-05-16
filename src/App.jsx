import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useQuery, gql } from "@apollo/client";
import { Button, Input } from "antd";

const CHAT = gql`
  query GetChat($prompt: String!) {
    aiChat(prompt: $prompt)
  }
`;

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const [sendText, setSendText] = useState("你好");

  const { loading, error, data } = useQuery(CHAT, {
    variables: { prompt: sendText },
  });

  // if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  console.log("data", data);
  const onChange = (e) => {
    // console.log("onChange", e.target.value);
    setText(e.target.value);
  };
  const onClick = () => {
    console.log("onClick", text);
    setSendText(text);
  };
  return (
    <>
      {data && <h6>{data.aiChat}</h6>}
      <div className="card">
        <Input onChange={onChange} placeholder="输入消息" />
        <Button loading={loading} onClick={onClick} type="primary">
          发送
        </Button>
      </div>
    </>
  );
}

export default App;
