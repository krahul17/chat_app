import React,{useState,useEffect} from 'react'
import { View, Text, StatusBar,Image,FlatList,StyleSheet,TouchableOpacity} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import {FAB} from 'react-native-paper'


export default function HomeScreen({user,navigation}) {
    
   // console.log(user)
    const [users,setUsers] = useState(null)
    const getUsers = async ()=>{
             const querySanp = await firestore().collection('users').where('uid','!=',user.uid).get()
             const allusers = querySanp.docs.map(docSnap=>docSnap.data())
            //  console.log(allusers)
             setUsers(allusers)
    }

    useEffect(()=>{
        getUsers()
    },[])

    const RenderCard = ({item})=>{
          return (
              <TouchableOpacity onPress={()=>navigation.navigate('chat',{name:item.name,uid:item.uid,
                status :typeof(item.status) =="string"? item.status : item.status.toDate().toString()
            })}>
              <View style={styles.mycard}>
                  <Image source={{uri:item.pic}} style={styles.img}/>
                  <View>
                      <Text style={styles.text}>
                          {item.name}
                      </Text>
                      <Text style={styles.text}>
                          {item.email}
                      </Text>
                  </View>
              </View>
              </TouchableOpacity>
          )
    }
    return (
       <>
        <StatusBar barStyle="light-content" backgroundColor={'#000'} />
        <View style={{flex:1}}>
            <FlatList 
              data={users}
              renderItem={({item})=> {return <RenderCard item={item} /> }}
              keyExtractor={(item)=>item.uid}
            />
             <TouchableOpacity
                style={styles.fab}
                // icon="plus"
                // color="black"
                onPress={() => navigation.navigate("account")}
            >

                <Image source={require('../assets/download.png')} onPress={() => navigation.navigate("account")}
                 style={styles.plusicon}/>
           
            
        </TouchableOpacity>
        </View>
       </>
    )
}


const styles = StyleSheet.create({
   img:{width:60,height:60,borderRadius:30,backgroundColor:"green"},
   text:{
    color:'#000',
       fontSize:18,
       marginLeft:15,
   },
   mycard:{
       flexDirection:"row",
       margin:3,
       padding:4,
       backgroundColor:"white",
       borderBottomWidth:1,
       borderBottomColor:'grey'
   },
   fab: {
    position: 'absolute',
    margin: 16,
    right: 30,
    bottom:30,
    backgroundColor:"white",
    borderWidth:1,
  },
  plusicon:{
    height:25,
    width:25
  }
 });

