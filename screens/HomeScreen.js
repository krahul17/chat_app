import React, { useState, useEffect } from 'react'
import { View, Text, StatusBar, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import { FAB } from 'react-native-paper'


export default function HomeScreen({ user,navigation }) {

    // console.log(user)
    const [users, setUsers] = useState(null)
    
    const getUsers = async () => {
        const querySanp = await firestore().collection('users').where('uid', '!=', user.uid).get()
        const allusers = querySanp.docs.map(docSnap => docSnap.data())
        //  console.log(allusers)
        setUsers(allusers)
    }

    useEffect(() => {
        getUsers()
    }, [])

    const RenderCard = ({ item }) => {

        const [messages, setMessages] = useState('');

        useEffect(() => {
            // getAllMessages()
        
            const docid = item.uid > user.uid ? user.uid + "-" + item.uid : item.uid + "-" + user.uid
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
              setMessages(allmsg[0])
            //   setListdata(allmsg[0])
            })
        
        
            return () => {
              unSubscribe()
            }
        
        
          }, [])


        // const [messages, setMessages] = useState('');
        // console.log(messages.text)

        // const getAllMessages = async () => {
        //     const docid = item.uid > user.uid ? user.uid + "-" + item.uid : item.uid + "-" + user.uid
        //     const querySanp = await firestore().collection('chatrooms')
        //         .doc(docid)
        //         .collection('messages')
        //         .orderBy('createdAt', "desc")
        //         .get()
        //     const allmsg = querySanp.docs.map(docSanp => {
        //         return {
        //             ...docSanp.data(),
        //             createdAt: docSanp.data().createdAt.toDate()
        //         }
        //     })
        //     setMessages(allmsg[0])


        // }

        // useEffect(() => {
        //     getAllMessages();
        // }, [])

        return (
            <TouchableOpacity onPress={() => navigation.navigate('chat', {
                name: item.name, uid: item.uid,
                status: typeof (item.status) == "string" ? item.status : item.status.toDate().toString()
            })}>
                <View style={styles.mycard}>
                    <Image source={{ uri: item.pic }} style={styles.img} />
                    <View>
                        <Text style={styles.text}>
                            {item.name}
                        </Text>
                        <Text style={styles.text}>
                            {messages ? messages.text : null}
                        </Text>

                    
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor={'#000'} />
            <View style={{ flex: 1 }}>
                <FlatList
                    data={users}
                    renderItem={({ item }) => { return <RenderCard item={item} /> }}
                    keyExtractor={(item) => item.uid}
                />
                <TouchableOpacity
                    style={styles.fab}
                    // icon="plus"
                    // color="black"
                    onPress={() => navigation.navigate("account")}
                >

                    <Image source={require('../assets/chaticon.png')} onPress={() => navigation.navigate("account")}
                        style={styles.plusicon} />


                </TouchableOpacity>
            </View>
        </>
    )
}


const styles = StyleSheet.create({
    img: { width: 60, height: 60, borderRadius: 30, backgroundColor: "green" },
    text: {
        color: '#000',
        fontSize: 18,
        marginLeft: 15,
    },
    mycard: {
        flexDirection: "row",
        margin: 3,
        padding: 4,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: 'grey'
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 30,
        bottom: 30,
        // backgroundColor: "white",
        // borderWidth: 1,
    },
    plusicon: {
        height: 40,
        width: 40
    }
});

