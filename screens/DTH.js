import React, { Component } from "react";
import {
    StyleSheet,
    WebView ,
    View,
    TouchableOpacity,
    Dimensions,
    AsyncStorage,
    ToastAndroid,
    NetInfo,
    Modal,
} from "react-native";
import { 
    Container,
    Spinner,
    Button,
    Text,
    Content,
    Header,
    Left,
    Right,
    Title,
    Body,
    Input,
    Card,
    CardItem,
    List,
    ListItem,
    Form,
    Picker,
    Item,
    Textarea,
    Label,
    Thumbnail,
} from 'native-base';
import {createDrawerNavigator,DrawerItems, SafeAreaView,createStackNavigator,NavigationActions } from 'react-navigation';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
const {width,height} = Dimensions.get('window');

export default class Prepaid extends Component {
    constructor(props){
        super(props);
        this.state = {
            renderCoponentFlag: false,
            btnClicked: false,
            soperator : 'Select Operator',
            mobno:'',
            amount:'',
            payM :'cash',
            data:this.props.data,
        }
    }
    componentDidMount() {
        setTimeout(() => {this.setState({renderCoponentFlag: true})}, 0);
    }

    sendRequest = async () =>{

        var user_id = await AsyncStorage.getItem('user_id');
        var name =  await AsyncStorage.getItem('profile_name');
        var group_id = await AsyncStorage.getItem('grp_id');
        var user_type = await AsyncStorage.getItem('user_type');
        var admin_id =  await AsyncStorage.getItem('admin_id');

        let sdata = [];
        for (const data of this.state.data) {
            if(data.OperatorName == this.state.soperator){
                sdata = data;
            }
        }

        this.setState({btnClicked:true});
        //console.log(id);
        fetch('http://paymoneyrecharge.co.in/index.php?action=api/recharge', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                user_id: user_id,
                name:name,
                group_id:group_id,
                user_type:user_type,
                admin_id:admin_id,
                data:sdata
            })
            }).then((response) => response.json())
                .then((responseJson) => {
                if(responseJson == "Invalid User_id or Password"){
                    alert(responseJson);
                }
                else{
                    //this.setData(responseJson);
                }
                console.log(responseJson); 
            }).catch((error) => {
                console.error(error);
            });
            this.setState({btnClicked:false});
    }

    render() {

        const opdata = this.props.data;
        let opcode = [];
        for (const data of opdata) {
            opcode.push(<Picker.Item label={data.OperatorName} value={data.OperatorName} />);
        }

        const {renderCoponentFlag} = this.state;
        if(renderCoponentFlag){
            return(
                <Container>
                    <Content>
                        <Form>
                            <Item floatingLabel style = {styles.item}>
                                <Label>Smart Card No.</Label>
                                <Input 
                                    onChangeText = {(text) => {this.setState({mobno:text}) }}
                                    value = {this.state.mobno}
                                    keyboardType = 'numeric'
                                />
                            </Item>
                            <Item >
                                <Picker
                                    selectedValue={this.state.soperator}
                                    style={{ height: 50 , backgroundColor:'#eaf1f4' }}
                                    onValueChange={(itemValue, itemIndex) => {this.setState({soperator:itemValue})}}>
                                    <Picker.Item label="Select Operator" value="Select Operator" />
                                    {opcode}
                                </Picker>
                            </Item>
                            <Item floatingLabel style = {styles.item}>
                                <Label>Amount</Label>
                                <Input 
                                    onChangeText = {(text) => { this.setState({amount:text})}}
                                    value = {this.state.amount}
                                    keyboardType = 'numeric'
                                />
                            </Item>
                            <Item floatingLabel style = {styles.item}>
                                <Label>Payment Method</Label>
                                <Input 
                                    onChangeText = {(text) => { this.setState({payM:text}) }}
                                    value = {this.state.payM}
                                    editable = {false}
                                />
                            </Item>
                            <Item style = {{paddingTop: 5,height:50}}>
                                <Left>

                                </Left>
                                <Body>
                                    <Button success>
                                        {(this.state.btnClicked) ? 
                                            <Spinner color='#2874f0' />
                                        :
                                            <Text>Submit</Text>
                                        }
                                    </Button>
                                </Body>
                                <Right>

                                </Right>
                            </Item>
                        </Form>
                    </Content>
                </Container>
            );
        }else{
            return (
            <AdvLoder/>
            );
        }
    }
}


class AdvLoder extends Component{
    render(){
        const {width,height} = Dimensions.get('window');
        return(
            <View style={{ flex: 1, width:width, justifyContent: 'center', alignItems: 'center',backgroundColor:'#fff'}}> 
                <Spinner color='#2874f0' size='large' style={{height:40}} />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    loder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});