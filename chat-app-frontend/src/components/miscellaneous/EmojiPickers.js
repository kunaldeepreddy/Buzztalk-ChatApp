import React from "react";

const EmojiPickers = ({ currentMessage, reactToMessage}) => {
  const emojiArray = ["👍", "😄", "😂", "❤️️", "👎"];

  const handleEmojiPicker = (emoji, messageId) => {
    // console.log(emoji, messageId)
    reactToMessage(emoji, messageId);
  }
  return (
    <div
      className="emojiPicker"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        borderRadius: "50px",
        border: "none",
      }}
    >
      {emojiArray.map((item)=> {
        return <span key={item} onClick={(e)=>{handleEmojiPicker(e.target.textContent,currentMessage._id)}}>{item}</span>
      })}
    </div>
  );
};

export default EmojiPickers;
