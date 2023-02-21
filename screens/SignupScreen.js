import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, StatusBar, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
// import { TextInput, Button } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';

import storage from '@react-native-firebase/storage'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [image, setImage] = useState(null)



    const [showNext, setShowNext] = useState(false)
    const [loading, setLoading] = useState(false)
    if (loading) {
        return <ActivityIndicator size="large" color="#00ff00" />
    }
    const userSignup = async () => {
        setLoading(true)
        if (!email || !password || !image || !name) {
            alert("please add all the field")
            return
        }
        try {
            const result = await auth().createUserWithEmailAndPassword(email, password)
            firestore().collection('users').doc(result.user.uid).set({
                name: name,
                email: result.user.email,
                uid: result.user.uid,
                pic: image,
                status: "online"
            })
            setLoading(false)
        } catch (err) {
            alert("something went wrong")
        }


    }
    const pickImageAndUpload = () => {

        launchImageLibrary({ quality: 0.5 }, (fileobj) => {
            const img = fileobj.assets[0];
            console.log()

            const uploadTask = storage().ref().child(`/userprofile/${Date.now()}`).putFile(img.uri)
            uploadTask.on('state_changed',
                (snapshot) => {

                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (progress == 100) alert('image uploaded')

                },
                (error) => {
                    alert("error uploading image")
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        setImage(downloadURL)
                    });
                }
            );
        })
    }
    return (
        <View style={styles.container}>
            <Image source={require('../assets/backImage.png')} style={styles.backImage} />
            <View style={styles.whiteSheet} />
            <SafeAreaView style={styles.form}>
                <StatusBar barStyle="light-content" backgroundColor={'#000'} />
                <Text style={styles.title}>Sign Up</Text>

                <View style={styles.box2}>
                    {!showNext &&
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter email"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                textContentType="emailAddress"
                                autoFocus={true}
                                mode="outlined"
                                value={email}
                                onChangeText={(text) => setEmail(text)}

                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter password"
                                autoCapitalize="none"
                                autoCorrect={false}
                                secureTextEntry={true}
                                textContentType="password"
                                mode="outlined"
                                value={password}
                                onChangeText={(text) => setPassword(text)}

                            />
                        </>
                    }

                    {showNext ?
                        <>
                            <TextInput

                                style={styles.input}
                                placeholder="Name"
                                autoFocus={true}
                                mode="outlined"
                                value={name}
                                onChangeText={(text) => setName(text)}
                            />

                            <TouchableOpacity  mode="contained" style={styles.button}  onPress={()=>pickImageAndUpload()}>
                                <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}> select profile pic</Text>
                            </TouchableOpacity>
                           
                            <TouchableOpacity mode="contained" style={styles.button} disabled={image ? false : true} onPress={() => userSignup()}>
                                <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}> Signup</Text>
                            </TouchableOpacity>

                        </>
                        :

                        <TouchableOpacity mode="contained" style={styles.button} onPress={() => setShowNext(true)}>
                            <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}> Next</Text>
                        </TouchableOpacity>

                    }

                    <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                        <Text style={{ color: 'gray', fontWeight: '600', fontSize: 14 }}>Already have an account ?</Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={{ color: '#f57c00', fontWeight: '600', fontSize: 14 }}> Log In</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </SafeAreaView>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: "orange",
        alignSelf: "center",
        paddingBottom: 24,
    },
    input: {
        backgroundColor: "#F6F7FB",
        height: 58,
        marginBottom: 20,
        fontSize: 16,
        borderRadius: 10,
        padding: 12,
    },
    backImage: {
        width: "100%",
        height: 340,
        position: "absolute",
        top: 0,
        resizeMode: 'cover',
    },
    whiteSheet: {
        width: '100%',
        height: '75%',
        position: "absolute",
        bottom: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 60,
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 30,
    },
    button: {
        backgroundColor: '#f57c00',
        height: 58,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
});
