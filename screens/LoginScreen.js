import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, KeyboardAvoidingView,TextInput, SafeAreaView,StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native'
// import { TextInput, Button } from 'react-native-paper';
import auth from '@react-native-firebase/auth'
export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    if (loading) {
        return <ActivityIndicator size="large" color="#00ff00" />
    }
    const userLogin = async () => {
        setLoading(true)
        if (!email || !password) {
            alert("please add all the field")
            return
        }
        try {
            const result = await auth().signInWithEmailAndPassword(email, password)
            setLoading(false)
        } catch (err) {
            alert("something went wrong")
        }


    }
    return (
      
            <View style={styles.container}>
                <Image source={require('../assets/backImage.png')} style={styles.backImage} />
                <View style={styles.whiteSheet} />
                <SafeAreaView style={styles.form}>
                <StatusBar barStyle="light-content" backgroundColor={'#000'} />
                    <Text style={styles.title}>Log In</Text>


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

                    <TouchableOpacity  mode="contained" style={styles.button} onPress={() => userLogin()}>
                        <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}> Log In</Text>
                    </TouchableOpacity>

                    <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                        <Text style={{ color: 'gray', fontWeight: '600', fontSize: 14 }}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("signup")}>
                            <Text style={{ color: '#f57c00', fontWeight: '600', fontSize: 14 }}> Sign Up</Text>
                        </TouchableOpacity>
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
