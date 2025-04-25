import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { useNavigate, useParams } from 'react-router-dom';

import { useSelector } from 'react-redux';
import styles from "../styles/Chat.module.scss";
import Messages from "./Messages";
import { StateSchema } from '@/app/providers/StoreProvider';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { chatActions, chatRideReducer } from '../model/slice/Chat.slice';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { Input } from '@/shared/ui/redesigned/Input';
import {Button} from "@/shared/ui/redesigned/Button";

const initialReducers: ReducersList = {
  chatSchema: chatRideReducer,
};

const socket = io('http://localhost:3001');

const Chat = (props:{isUserToUser?:boolean}) => {
  const {isUserToUser = false} = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = useSelector((state:StateSchema) => state?.user.authData?.id);
  const userName = useSelector((state:StateSchema) => state.user.authData?.username);
  const message = useSelector((state:StateSchema) => state.chatSchema?.message);
  const messages = useSelector((state:StateSchema) => state.chatSchema?.messages) || [];
  const usersCount = useSelector((state:StateSchema) => state.chatSchema?.users);
  const[roomId, setRoomId] = useState('')


  useEffect(() => {
    socket.emit("join", { room: id, name: userName, isUserToUser, userId });

    return () => {
      socket.off("join");
    };
  }, [userName, id, isUserToUser, userId, socket]);

  useEffect(() => {
    const handleInitMessages = ({ messages, roomId }) => {
      dispatch(chatActions.setInitMessages(messages));
      if (isUserToUser){
        setRoomId(roomId);
      }
    };

    socket.on("initMessages", handleInitMessages);

    return () => {
      socket.off("initMessages", handleInitMessages);
    };
  }, [dispatch, isUserToUser, socket]);

  useEffect(() => {
    const handleMessage = (data) => {
      dispatch(chatActions.setMessages(data));
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [dispatch, socket]);

  useEffect(() => {
    const handleRoomUpdate = (users) => {
      dispatch(chatActions.setUsersLength(users.length));
    };

    socket.on("room", handleRoomUpdate);

    return () => {
      socket.off("room", handleRoomUpdate);
    };
  }, [dispatch, socket]);


  const leftRoom = () => {
    navigate("/");
  };
  // @ts-ignore
  const handleChange = (e) => dispatch(chatActions.setMessage(e));

  const handleSubmit = (e:any) => {
    e.preventDefault();

    if (!message) return;

    socket.emit("sendMessage", { message, params: { room: isUserToUser? roomId: id, name: userName,isUserToUser, userId } });

    dispatch(chatActions.setMessage(""))
  };

  return (
      <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
        <div className={styles.wrap}>
          <div className={styles.header}>
            <div className={styles.title}>{id}</div>
            <Button className={styles.left} onClick={leftRoom}>
              Left the room
            </Button>
          </div>

          <div className={styles.messages}>
            {/* // @ts-ignore */}
            <Messages messages={messages} name={userName || ''} />
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.input}>
              <Input
                  type="text"
                  name="message"
                  placeholder="What do you want to say?"
                  value={message}
                  onChange={handleChange}
                  autoComplete="off"
                  required
              />
            </div>
            <div className={styles.button}>
              <Input type="submit" onSubmit={handleSubmit} value="Send a message" />
            </div>
          </form>
        </div>
      </DynamicModuleLoader>
  );
};

export default Chat;
