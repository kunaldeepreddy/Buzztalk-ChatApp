import { Avatar } from "@chakra-ui/avatar";
import React, { useEffect, useState } from "react";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow
} from "@chakra-ui/react";
import "./ScrollableChat.css";
import { ChatState } from "../Context/ChatProvider";
import { BsEmojiSmileFill } from "react-icons/bs";
import EmojiPickers from "./miscellaneous/EmojiPickers";

const ScrollableChat = ({ messages, reactToMessage}) => {
  const [isHovering, setIsHovering] = useState(false);

  // useEffect(()=> {
  //    console.log(messages);
  // })

  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages && messages?.length !=0 &&
        messages?.map((m, i) => (
          <div
            style={{ display: "flex" }}
            key={m._id}
            onMouseEnter={() => setIsHovering(m._id)}
            onMouseLeave={() => setIsHovering()}
          >
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip
                label={m.messageSender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.messageSender.name}
                />
              </Tooltip>
            )}
            <span
              style={{
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                display: "flex",
                flexDirection: "row",
                gap: 10,
              }}
            >
              <span
                style={{
                  marginTop: isSameUser(messages, m, i, user._id) ? 10 : 10,
                }}
              >
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "10px" }}
                >
                  {isHovering === m._id &&
                      m.messageSender._id === user._id ? (
                  <Popover placement="top" trapFocus={false}>
                    <PopoverTrigger>
                      {isHovering === m._id &&
                      m.messageSender._id === user._id ? (
                        <div style={{}} className="emojis">
                          <BsEmojiSmileFill />
                        </div>
                      ) : (
                        <div className="emojis"> </div>
                      )}
                    </PopoverTrigger>
                    <PopoverContent
                      h="30px"
                      w="150px"
                      backgroundColor="#f0f0f0"
                    >
                      <PopoverArrow />
                      <EmojiPickers
                        currentMessage={m}
                        reactToMessage={reactToMessage}
                      />
                    </PopoverContent>
                  </Popover>):""}
                  <div
                    style={{
                      backgroundColor: `${
                        m.messageSender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                      }`,
                      borderRadius: "15px",
                      padding: "5px 15px",
                      width: "auto",
                      // width:"100px",
                      maxWidth: "400px",
                    }}
                  >
                    {m.content}
                  </div>
                  {isHovering === m._id &&
                      m.messageSender._id !== user._id ? (
                  <Popover placement="top" trapFocus={false}>
                    <PopoverTrigger>
                      {isHovering === m._id &&
                      m.messageSender._id !== user._id ? (
                        <div
                          style={{
                            marginLeft: "10px",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          className="emojis"
                        >
                          <BsEmojiSmileFill />
                        </div>
                      ) : (
                        <div
                          style={{
                            marginLeft: "20px",
                          }}
                          className="emojis"
                        >
                          {" "}
                        </div>
                      )}
                    </PopoverTrigger>
                    <PopoverContent
                      h="30px"
                      w="150px"
                      backgroundColor="#f0f0f0"
                    >
                      <PopoverArrow />
                      <EmojiPickers
                        currentMessage={m}
                        reactToMessage={reactToMessage}
                      />
                    </PopoverContent>
                  </Popover>) : ""}
                </div>
                <Popover placement="right" width="auto" trapFocus={false}>
                  <PopoverTrigger>
                    {m.reactions && m.reactions.length !== 0 ? (
                      <div
                        className="emojiDisplayer"
                        style={{
                          width: "auto",
                          maxWidth: "50px",
                          padding: "2px",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          borderRadius: "50px",
                          border: "0.5px",
                          backgroundColor: "rgb(255 255 255)",
                          float: `${
                            m.messageSender._id === user._id ? "right" : "left"
                          }`,
                        }}
                      >
                        <span>{m.reactions[0].emoji}</span>
                        {m.reactions.length > 1 && (
                          <span>{m.reactions[1].emoji}</span>
                        )}
                        {m.reactions.length > 2 && <span>+</span>}
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </PopoverTrigger>
                  <PopoverContent
                    h="auto"
                    w="auto"
                    backgroundColor="#f0f0f0"
                    padding="5px"
                  >
                    <PopoverArrow />
                    {m.reactions?.map((item) => {
                      return (
                        <div key={item.emoji}>
                          {item?.emoji} {item.count}
                        </div>
                      );
                    })}
                  </PopoverContent>
                </Popover>
              </span>
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
