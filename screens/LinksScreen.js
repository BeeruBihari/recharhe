import React from 'react';
import { ScrollView,View, StyleSheet,Dimensions,AsyncStorage } from 'react-native';
const {height,width} = Dimensions.get('window');
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import { Container, Spinner, Button, Item,Input,CheckBox,Content, ListItem,Switch, Header, Title, Subtitle, Tab, Tabs, Body, Left, Thumbnail, Right} from 'native-base';
import Prepaid from './Prepaid';
import Postpaid from  './Postpaid';
import DTH from './DTH';

export default class LinksScreen extends React.Component {
 
  constructor(props){
    super(props);
    this.state = {
        renderCoponentFlag: false,
        password:"",
        prepaid:[],
        postpaid:[],
        dth:[],
        balance:'',
        logo:'a',
        name:''
    }
}

componentWillMount(){
  this._Fatch_Operator();
}

setData = async(rdata) =>{
    var balance = await AsyncStorage.getItem('balance');
    var name =  await AsyncStorage.getItem('profile_name');
    var logo = await AsyncStorage.getItem('logo');
    logo = (logo) ? 'http://paymoneyrecharge.co.in/uploads/b2b_user_logo/'+logo : 'http://paymoneyrecharge.co.in/uploads/b2b_user_logo/adhaar_1514051516.png';

    let prepaid = [];
    let postpaid = [];
    let dth = [];
    for (const data of rdata) {
       if(data.RechargeType == "Prepaid"){
          prepaid.push(data);
       }
       else if(data.RechargeType == "DTH"){
          dth.push(data);
       }else if(data.RechargeType == "Postpaid"){
          postpaid.push(data);
       }
    }
    this.setState({
      balance:balance,
      logo:logo,
      name:name,
      prepaid:prepaid,
      postpaid:postpaid,
      dth:dth,
    });
}

_Fatch_Operator = async() => {

  var id = await AsyncStorage.getItem('grp_id');
  this.setState({renderCoponentFlag:true});
  console.log(id);
  fetch('http://paymoneyrecharge.co.in/index.php?action=api/getOprtr', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        id: id,
      })
    }).then((response) => response.json())
          .then((responseJson) => {
          if(responseJson == "Invalid User_id or Password"){
              alert(responseJson);
          }
          else{
             this.setData(responseJson);
          }
          //console.log(responseJson); 
      }).catch((error) => {
          console.error(error);
      });
      this.setState({renderCoponentFlag:false});
}

_logout = async() => {
  await AsyncStorage.removeItem('user_id');
  this.props.navigation.navigate('load');
}
  
render() {
    if(!this.state.renderCoponentFlag)
      return (
          <Container>
            <Header hasSubtitle>
                <Left>
                  <Thumbnail small source={{uri: this.state.logo}} /> 
                </Left>
                <Body>
                    <Title>{this.state.name}</Title>
                    <Subtitle>Balance : {this.state.balance}</Subtitle>
                </Body>
                <Right>
                  <Button onPress={() => this._logout()}>
                    <Icon name = "logout" size = {15} ></Icon>
                  </Button>
                </Right>
            </Header>
            <Tabs>
              <Tab heading = "Prepaid">
                  <Prepaid  data = {this.state.prepaid}/>
              </Tab>
              <Tab heading = "Postpaid">
                  <Postpaid data = {this.state.postpaid}/>
              </Tab>
              <Tab heading = "DTH">
                    <DTH data = {this.state.dth}/>
              </Tab>
            </Tabs>
          </Container>
      );
    else
      return(
        <View style={styles.loder}>
          <Spinner  color='blue'/>
        </View>
      );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  loder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
