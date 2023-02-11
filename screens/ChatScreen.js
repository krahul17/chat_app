import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import { GiftedChat, Bubble, InputToolbar, Send } from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ChatScreen({ user, route }) {

  const [messages, setMessages] = useState([]);

  const [imageData, setImageData] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const { uid, name } = route.params;


  const getAllMessages = async () => {
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid
    const querySanp = await firestore().collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', "desc")
      .get()
    const allmsg = querySanp.docs.map(docSanp => {
      return {
        ...docSanp.data(),
        createdAt: docSanp.data().createdAt.toDate()
      }
    })
    setMessages(allmsg)


  }
  useEffect(() => {
    // getAllMessages()

    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid
    const messageRef = firestore().collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', "desc")

    const unSubscribe = messageRef.onSnapshot((querySnap) => {
      const allmsg = querySnap.docs.map(docSanp => {
        const data = docSanp.data()
        if (data.createdAt) {
          return {
            ...docSanp.data(),
            createdAt: docSanp.data().createdAt.toDate()
          }
        } else {
          return {
            ...docSanp.data(),
            createdAt: new Date()
          }
        }

      })
      setMessages(allmsg)
    })


    return () => {
      unSubscribe()
    }


  }, [])

  const onSend = (messageArray) => {
    console.log('fsfsf');
    let mymsg = null;
    if (imageUrl !== '') {
      const msg = messageArray[0]
      mymsg = {
        ...msg,
        sentBy: user.uid,
        sentTo: uid,
        image: imageUrl,
        createdAt: new Date()
      }
    } else {
      const msg = messageArray[0]
      mymsg = {
        ...msg,
        sentBy: user.uid,
        sentTo: uid,
        image: '',
        createdAt: new Date()

      }
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg))
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid

    firestore().collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .add({ ...mymsg, createdAt: firestore.FieldValue.serverTimestamp() })

    setImageUrl('');
    setImageData(null);
  }

  const openCamera = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    console.log(result, '999999999');
    if (result.didCancel && result.didCancel == true) {
    } else {
      setImageData(result);
      uplaodImage(result);
    }
  };
  const uplaodImage = async imageDataa => {
    const reference = storage().ref(imageDataa.assets[0].fileName);
    const pathToFile = imageData.assets[0].uri;
    await reference.putFile(pathToFile);
    const url = await storage().ref(imageData.assets[0].fileName).getDownloadURL();
    console.log('000url', url);
    setImageUrl(url);
  };
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={'#000'} />
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <GiftedChat
          messages={messages}
          alwaysShowSend
          // onSend={text => onSend(text)}
          onSend={messages => onSend(messages)}
          user={{
            _id: user.uid,
            name: name
          }}
          renderBubble={(props) => {
            return <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: "#95DDFA",
                  borderTopRightRadius: 15
                },
                left: { borderTopLeftRadius: 15 },

              }}



            />
          }}

          renderSend={(props) => {
            return (
              <View style={styles.sendimgg}>

                {imageUrl !== '' ? (

                  <View>
                    <Image source={{ uri: imageData.assets[0].uri }} style={styles.imggh} />
                    <TouchableOpacity
                      onPress={() => {
                        setImageUrl('');
                      }}>
                      <Image
                        source={require('../assets/download.png')}
                        style={{ width: 16, height: 16, tintColor: '#fff' }}
                      />
                    </TouchableOpacity>
                  </View>)
                  :
                  null}

                <TouchableOpacity onPress={() => { openCamera() }}>
                  <Image source={require('../assets/plus.png')} style={styles.imggh} />
                </TouchableOpacity>

                <Send {...props} containerStyle={{ justifyContent: 'center', marginLeft: 15 }}>

                  <Image source={require('../assets/sentb.png')} style={styles.imggh2} />

                </Send>
              </View>

            )
          }}

          renderInputToolbar={(props) => {
            return <InputToolbar {...props}
              containerStyle={{ borderTopWidth: 1.5, borderTopColor: '#E5E5E5' }}
              textInputStyle={{ color: "#000" }}

            />
          }}

        />
      </View>
    </>)
}

const styles = StyleSheet.create({
  sendimgg: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  imggh: {
    height: 20,
    width: 20,
    // marginLeft:-30,
    // marginBottom:5
  },
  imggh2: {
    height: 20,
    width: 20,
    marginRight: 10,
  }

});
