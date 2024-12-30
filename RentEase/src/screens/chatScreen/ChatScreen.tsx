import React, {useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, TextInput, StatusBar} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {get_chatList} from '../../services';
import {Constants} from '../../constants';
import {useIsFocused} from '@react-navigation/native';
import {Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import Theme from '../../theme/Theme';

const ChatListScreen = (props: any) => {
  const isFocused = useIsFocused();
  const [search, setSearch] = useState('');

  const {data, error, isLoading} = useQuery({
    queryKey: ['chatList'],
    queryFn: get_chatList,
    enabled: isFocused,
  });

  const filteredData = data?.filter((item: any) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );
  console.log(data);

  return (
    <View style={styles.chatListContainer}>
      <StatusBar barStyle='dark-content' backgroundColor="black" />
      <Text style={styles.headerTitle}>Chats</Text>
      <View style={styles.searchInput}>
        <TextInput
          placeholder="Search"
          placeholderTextColor="#888"
          value={search}
          style={{
            color: Theme.colors.white,
            height: Theme.responsiveSize.size30,
          }}
          onChangeText={setSearch}
        />
        <Icon name="search" size={20} color="#fff" />
      </View>
      <FlatList
        data={filteredData}
        keyExtractor={item => item.user_id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => {
              props.navigation.navigate(Constants.MESSAGE_SCREEN, {
                name: item.name,
                userID: item.user_id,
              });
            }}>
            <View style={styles.chatInfo}>
              <View style={styles.flexRow}>
                <Image source={{uri: item.image}} style={styles.image} />
                <View>
                  <Text style={styles.chatName}>{item.name}</Text>
                  <Text style={styles.chatMessage}>
                    {item.last_message.content}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                rowGap: Theme.responsiveSize.size3,
                alignItems: 'center',
              }}>
              <Text style={styles.chatMessage}>
                {item.last_message.timestamp}
              </Text>
              {item.unread_count > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread_count}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ChatListScreen;
