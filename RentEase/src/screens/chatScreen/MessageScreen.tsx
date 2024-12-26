import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import styles from './styles';
import {delete_messages, get_message, send_message} from '../../services';
import Theme from '../../theme/Theme';
import {getDataFromCachedWithKey} from '../../module/cacheData';
import {AppConstants} from '../../module';

export default function MessageScreen(props: any) {
  const [selectedMessages, setSelectedMessages] = useState<any>([]);
  const [userName, setUserName] = useState({
    userName: '',
    userImage: '',
  });
  const [messages, setMessages] = useState<any>([]);
  const navigation = useNavigation();
  const {userID} = props.route?.params;
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState();
  const scrollViewRef: any = useRef(null);
  const socket = useRef<WebSocket | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerStyle: {
        backgroundColor: Theme.colors.black,
      },
      headerLeft: () => (
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={Theme.icons.back_arrow} />
          </TouchableOpacity>

          {selectedMessages.length > 0 ? (
            <View>
              <Text style={{fontSize: 16, fontWeight: '500'}}>
                {selectedMessages.length}
              </Text>
            </View>
          ) : (
            <View style={styles.imgContainer}>
              <Image style={styles.img} source={{uri: userName.userImage}} />
              <Text style={styles.userNameText}>{userName.userName}</Text>
            </View>
          )}
        </View>
      ),
      headerRight: () =>
        selectedMessages.length > 0 ? (
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => {
                deleteMessages();
              }}>
              <Image source={Theme.icons.delete_icon} />
            </TouchableOpacity>
          </View>
        ) : null,
    });
  }, [selectedMessages, userName]);

  const formatTime = (time: any) => {
    const date = new Date(time);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    const Newtime: any = `${hours}:${minutes} ${amPm}`;
    return Newtime;
  };

  const handleSelectMessage = (message: any) => {
    const isSelected = selectedMessages.includes(message.id);
    if (isSelected) {
      setSelectedMessages((previousMessages: any) =>
        previousMessages.filter((id: any) => id !== message.id),
      );
    } else {
      setSelectedMessages((previousMessages: any) => [
        ...previousMessages,
        message.id,
      ]);
    }
  };

  const fetchMessages = async () => {
    try {
      const res: any = await get_message(userID);
      if (res.status == 'success') {
        setUserName({
          userName: res.receiverName,
          userImage: res.receiverImage,
        });
        setMessages(res.messages);
      }
    } catch (error) {
      console.log('Error fetching messages:', error);
    }
  };

  const handleSend = async () => {
    try {
      let item = {
        receiver_id: userID,
        content: message,
      };
      const newMessage = {
        senderId: userId,
        receiverId: userID,
        content: message,
        timestamp: new Date().toISOString(),
      };
      if (socket.current) {
        socket.current.send(JSON.stringify(newMessage));
      }
      const response = await send_message(item);
      // fetchMessages();
      setMessage('');
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  };

  useEffect(() => {
    scrollToBottom();
    const getUserID = async () => {
      const userID: any = await getDataFromCachedWithKey(
        AppConstants.AsyncKeyLiterals.userId,
      );
      setUserId(userID);
    };
    getUserID();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchMessages();
    }, []),
  );

  useEffect(() => {
    console.log('userId', userId);
    socket.current = new WebSocket(
      `ws://192.168.100.153:8080/ws?userId=${userID}`,
    );

    socket.current.onmessage = event => {
      if (event.data) {
        try {
          const incomingMessage = JSON.parse(event.data);
          console.log(incomingMessage);
          setMessages((prevMessages: any) => {
            return [...(prevMessages || []), incomingMessage];
          });
          scrollToBottom();
        } catch (error) {
          console.error('Error parsing incoming message:', error);
        }
      }
    };

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [userId]);

  const deleteMessages = async () => {
    try {
      let data = {
        messages: selectedMessages,
      };
      const res = await delete_messages(data);
      console.log(res)
      if (res) {
        setSelectedMessages((prevSelectedMessages: any) =>
          prevSelectedMessages.filter(
            (id: any) => !selectedMessages.includes(id),
          ),
        );
        fetchMessages();
      }
    } catch (error: any) {
      console.log(error.response.data);
    }
  };
  console.log( userId)

  return (
    <KeyboardAvoidingView style={styles.contianer}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{flexGrow: 1}}
        onContentSizeChange={scrollToBottom}>
        {messages?.map((item: any, index: any) => {
          const isSelected = selectedMessages.includes(item.id);
          return (
            <Pressable
              onLongPress={() => handleSelectMessage(item)}
              key={index}
              style={[
                item?.senderId == userId
                  ? styles.sendMessgContainer
                  : styles.recevierMessgContainer,
                isSelected && {width: '100%', backgroundColor: '#F0FFFF'},
              ]}>
              <Text
                style={[
                  styles.messgText,
                  {
                    textAlign: isSelected ? 'right' : 'left',
                  },
                ]}>
                {item?.content}
              </Text>
              <Text style={styles.messgTime}>{formatTime(item.timestamp)}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={text => setMessage(text)}
          style={styles.input}
          placeholder="Type Your message..."
        />
        <Pressable
          onPress={() => handleSend()}
          disabled={message === ''}
          style={styles.messgSendBtn}>
          <Text style={styles.messgSendText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
