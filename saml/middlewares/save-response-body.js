
// src: https://stackoverflow.com/questions/33732509/express-js-how-to-intercept-response-send-response-json

export default function(req, res, next) {

  const oldSend = res.send;

  res.send = (...args) => {
      res.body = res?.body || args[0];
      res.send = oldSend;
      return res.send(...args);
  };  

  next();
}