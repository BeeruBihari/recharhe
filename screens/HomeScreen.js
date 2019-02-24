import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  AsyncStorage
} from 'react-native';

const {height,width} = Dimensions.get('window');
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import { Container, Spinner, Button, Item,Input,CheckBox,Content, ListItem,Switch} from 'native-base';


export default class HomeScreen extends React.Component {
  constructor(props){
      super(props);
      this.state = {
          renderCoponentFlag: false,
          submitButtonDisable:false,
          forgot_submitButtonDisable:false,
          email_or_phone:"",
          password:"",
        }
    }

_StoreData = async (data) =>{

    var profile = JSON.parse(data);
    console.log("profile : ",profile);
    await AsyncStorage.setItem('balance',profile.balance);
    await AsyncStorage.setItem('grp_id',profile.grp_id);
    await AsyncStorage.setItem('profile_name',profile.profile_name);
    await AsyncStorage.setItem('user_id',profile.user_id);
    await AsyncStorage.setItem('user_name',profile.user_name);
    await AsyncStorage.setItem('user_type',profile.user_type);
    await AsyncStorage.setItem('logo',profile.logo);
    await AsyncStorage.setItem('admin_id',profile.admin_id);   
    this.props.navigation.navigate('home');
  
}


  submitLogin = () =>{
    console.log('Json Called.');
    fetch('http://paymoneyrecharge.co.in/index.php?action=api/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: this.state.email_or_phone,
          password: this.state.password,
        })
      }).then((response) => response.json())
            .then((responseJson) => {
            if(responseJson == "Invalid User_id or Password"){
                alert(responseJson);
            }
            else{
                this._StoreData(JSON.stringify(responseJson));
            }
           // console.log(responseJson); 
        }).catch((error) => {
            console.error(error);
        });     

  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',borderRadius:0.2,borderColor:'#fff'}}>
        <View style={{ width: width*(0.95), height: 300,backgroundColor:"#ffffff",borderRadius:15,borderColor:'#fff'}}>
            <Text style={{fontSize:30,alignSelf:'center'}}>Sign In</Text>
            <View style={{ width: width*(0.85), alignSelf:'center',marginVertical:5}}>
                <Item regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                    <Input 
                        placeholder='Email' 
                        onChangeText={(text) => this.setState({email_or_phone:text})}
                        textContentType='username'
                    />
                </Item>
                <Item regular style={{marginVertical:2,borderRadius:15,paddingHorizontal: 7,}}>
                    <Input 
                        placeholder='Password'
                        onChangeText={(text) => this.setState({password:text})} 
                        secureTextEntry={true}
                        textContentType='password'
                    />
                </Item>
                {/* <TouchableOpacity style={{marginVertical:5}} onPress={this.forgotPasswordStart}>
                    <Text style={{alignSelf:'flex-end'}}>Forgot Password?</Text>
                </TouchableOpacity>                   */}
                <Text></Text>
                <Button rounded success block 
                    onPress={this.submitLogin}
                >
                    <Text>Login</Text>
                </Button>
            </View>
        </View>
    </View>
    );
  }
}

