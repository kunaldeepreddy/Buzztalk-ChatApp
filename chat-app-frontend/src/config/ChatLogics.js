export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].messageSender._id === m.messageSender._id &&
    messages[i].messageSender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].messageSender._id !== m.messageSender._id &&
      messages[i].messageSender._id !== userId) ||
    (i === messages.length - 1 && messages[i].messageSender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameSender = (messages, m, i, userId) => {
  // console.log(messages, m, i, userId);
  let value = i < messages.length - 1 &&
  (messages[i + 1].messageSender._id !== m.messageSender._id ||
    messages[i + 1].messageSender._id === undefined) &&
  messages[i].messageSender._id !== userId;
  // console.log("isSameSender ",value);
  return value;
};

export const isLastMessage = (messages, i, userId) => {
  // console.log(messages, i, userId);
  let value = i === messages.length - 1 &&
  messages[messages.length - 1].messageSender._id !== userId &&
  messages[messages.length - 1].messageSender._id;
  // console.log("isLastMessage ",value);
  return value;
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].messageSender._id === m.messageSender._id;
};

export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
