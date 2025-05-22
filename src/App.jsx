import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useQuery, gql } from "@apollo/client";
import { Button, Input } from "antd";
import { MastraClient } from "@mastra/client-js";

const CHAT = gql`
  query GetChat($prompt: String!) {
    aiChat(prompt: $prompt)
  }
`;

function App() {
  const [text, setText] = useState("");
  const [sendText, setSendText] = useState("你好");

  // 初始化 Mastra 客户端（请替换 YOUR_API_KEY 为你的 Mastra API Key）
  const mastra = new MastraClient({
    // apiKey: "YOUR_API_KEY", // 推荐用 .env 文件存储
    baseUrl: "https://mastra-app.lao-di.us" // 使用你自己的 Mastra 服务地址
  });

  const { loading, error, data } = useQuery(CHAT, {
    variables: { prompt: sendText },
  });

  const [mastraReply, setMastraReply] = useState("");

  // if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  console.log("data", data);
  const onChange = (e) => {
    // console.log("onChange", e.target.value);
    setText(e.target.value);
  };
  // 获取 agent 实例（请将 dev-agent-id 替换为你的实际 agentId，通常为 default 或 agent-1）
  const agent = mastra.getAgent("travelAgent");
  const onClick = async () => {
    // setSendText(text);
    // 调用 Mastra agent.generate
    try {
      const res = await agent.generate({
        messages: [
          { role: "user", content: text }
        ]
      });
      setMastraReply(res.text || "无回复");
    } catch (e) {
      setMastraReply("Mastra 调用失败: " + e.message);
    }
  };
  return (
    <>
      {/* Mastra 聊天回复 */}
      {mastraReply && <h6>Mastra: {mastraReply}</h6>}
      {/* 你原有的 GraphQL aiChat 回复 */}
      {data && <h6>GraphQL: {data.aiChat}</h6>}
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
