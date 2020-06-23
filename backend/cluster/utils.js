const sendMessage = module.exports.sendMessage = data => {
  process.send(data, null, {}, err => {
    if (err) console.error(err);
  });
};

module.exports.sendNormMessage = (type, msg, error) => {
  const data = { type: type, data: error, listenerId: msg.listenerId };
  sendMessage(data);
};
