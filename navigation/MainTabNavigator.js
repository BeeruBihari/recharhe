import React from 'react';
import { Platform ,
    ActivityIndicator,
    View,
    AsyncStorage,
    StyleSheet
} from 'react-native';
import { createStackNavigator, createBottomTabNavigator,createSwitchNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import Login from '../screens/HomeScreen';
import Home from '../screens/LinksScreen';


class AuthLoadingScreen extends React.Component {
    static navigationOptions = {
      header:null,
    };
    constructor() {
      super();
      this._bootstrapAsync();
    }
  
    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem('user_id');
      console.log(userToken);
      this.props.navigation.navigate(userToken ? 'home' : 'login');
    };
  
    // Render any loading content that you like here
    render() {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }
  }


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});


const MainPage = createStackNavigator(
    {
        Home:{
            screen:Home,
            navigationOptions: ({ navigation }) =>({
                headerTitle:'Recharge',
            }),
        },
    },
    {
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#2874f0',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },  
    }
);


const RootStack = createStackNavigator(
  {
      Login:{
          screen:Login,
          navigationOptions: ({ navigation }) =>({
              headerTitle:'Login ',
          }),
      },
  },
  {
      navigationOptions: {
          headerStyle: {
              backgroundColor: '#2874f0',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
              fontWeight: 'bold',
          },
      },  
  }
);

export default createSwitchNavigator(
    {
       load:{
        screen:AuthLoadingScreen,
      },
      login: {
        screen:RootStack,
      },
      home: {
        screen:MainPage,
      }
    },
    { 
      initialRouteName: 'load',
      mode: 'modal',
      headerMode: 'none',
      navigationOptions: {
        header:null
      },
    }
);
