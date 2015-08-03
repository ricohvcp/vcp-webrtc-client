answer 側から createDataChannel をリクエストしてシグナリングしても、追加できない。
offer 側からならできる。

chrome と firefox で一旦 peer つないだあとに addStream で追加した stream は
 chrome 側で stream.id が取れない。
 chrome 側で onaddstream が発火しない。
