import React, { useEffect, useRef } from 'react';

import styles from "../styles/Messages.module.scss";

type Props = {
  messages:Array<{user:string, message:string}>,
  name: string,
}
const Messages = ({ messages, name }:Props) => {
  const bottomRef = useRef(null);

  useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  return (
      <div className={styles.messages}>
        {messages.map(({ user, message }, i) => {
          const itsMe =
              user.trim().toLowerCase() === name.trim().toLowerCase();
          const className = itsMe ? styles.me : styles.user;

          return (
              <div key={i} className={`${styles.message} ${className}`}>
                <span className={styles.user}>{user}</span>

                <div className={styles.text}>{message}</div>
              </div>
          );
        })}
        <div ref={bottomRef} />

      </div>
  );
};

export default Messages;
