import { StyleSheet, TextInput } from "react-native";
import { request } from "../../utils/request";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text, View } from "../../components/Themed";
import { useEffect, useState } from "react";
import { Button, Icon } from "@rneui/base";

export default function TabOneScreen() {
  // loading flag
  const [loading, setLoading] = useState<boolean>(false);
  // 输入框的值
  const [inputValue, setInputValue] = useState<string>("");
  // 本地内存中读取聊天记录，如果没有则为空数组
  const [chatList, setChatList] = useState<any>(JSON.parse(localStorage.getItem("chatList") || "[]"));
  // 监听数组变化，如果数组发生变化，则将数组存储到本地
  useEffect(() => {
    localStorage.setItem("chatList", JSON.stringify(chatList));
  }, [chatList]);
  // 发送消息
  const sendMsg = async () => {
    // 如果输入框为空，则不发送请求
    if (!inputValue) {
      return alert("请输入内容");
    }
    const messages = [
      ...chatList,
      {
        role: "user",
        content: inputValue,
      },
    ];
    setChatList(messages);
    const params = {
      model: "gpt-3.5-turbo",
      messages,
    };
    setInputValue("");

    // --------------------------------------Axios-------------------------------------------------
    // 发送axios网络请
    request("/v1/chat/completions", params)
      .then((res: any) => {
        // 加载中
        setLoading(true);
        console.log("请求成功");
        console.log(res);
        const { role, content } = res.choices[0].message;
        setChatList([
          ...messages,
          {
            role,
            content,
          },
        ]);
      })
      .catch((err) => {
        console.log("请求失败", err);
      })
      .finally(() => {
        console.log("请求完成");
        setLoading(false);
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.chatList}>
        {chatList.map((item: any, index: number) => {
          return (
            <Text
              key={index}
              style={item.role === "assistant" ? styles.botMsg : styles.myMsg}
            >
              {item.content}
            </Text>
          );
        })}
      </View>
      <View style={styles.chatContainer} lightColor="#fff" darkColor="grey">
        <TextInput
          style={styles.promptIpt}
          placeholder="请输入问题进行查询"
          clearButtonMode="always"
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
        />
        <View style={styles.sendBtn}>
          {(loading && (
            <View style={styles.loadingWrap}>
              {/* <Dialog.Loading
                loadingStyle={{
                  width: "100%",
                  height: "50px",
                  backgroundColor: "#4387d6",
                  opacity: 0.8,
                }}
              /> */}
              <Icon
                name="home"
                style={{ fontSize: 28, color: "#adbfd5" }}
              ></Icon>
            </View>
          )) || (
            <Button
              type="outline"
              size="lg"
              icon={
                <FontAwesome
                  size={28}
                  style={{ marginBottom: -3 }}
                  name="magic"
                  color="#fff"
                />
              }
              onPress={sendMsg}
            />
          )}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  chatList: {
    width: "100%",
    height: "90%",
    overflow: "scroll",
    borderWidth: 1,
  },
  botMsg: {
    maxWidth: "80%",
    backgroundColor: "#fff",
    color: "#000",
    borderWidth: 1,
    // textAlign: "left",
    lineHeight: "2.5em",
    marginTop: 10,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginLeft: 10,
    paddingLeft: 10,
    paddingRight: 10,
    // 超过最大宽度自动换行
    flexWrap: "wrap",
    textAlign: "justify",
  },
  myMsg: {
    maxWidth: "80%",
    color: "#000",
    backgroundColor: "#a9ea7a",
    flexWrap: "wrap",
    // textAlign: "right",
    lineHeight: "2.5em",
    marginTop: 10,
    textAlign: "justify",
    borderRadius: 5,
    alignSelf: "flex-end",
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  chatContainer: {
    width: "100%",
    height: "50px",
    position: "relative",
  },
  promptIpt: {
    width: "80%",
    height: "100%",
    borderWidth: 0,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  sendBtn: {
    width: "20%",
    position: "absolute",
    bottom: 0,
    right: 0,
    height: "100%",
  },
  btn: {
    height: "100%",
  },
  loadingWrap: {
    display: "flex",
    justifyContent: "center",
  },
});
