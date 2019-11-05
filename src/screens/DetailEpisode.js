import React, {Component} from 'react';
import {
  Container, 
  Content, 
  View, 
  Text, 
  Row,
  Icon,  
  } 
  from 'native-base';
import { StyleSheet, FlatList, Dimensions, Share, Image} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import config from '../../config-env'


  export default class DetailEp extends Component{
    
    constructor(props){
        super(props);
        this.state = {
          token: '',
          skId: props.navigation.getParam('skId'),
          chId: props.navigation.getParam('chId'),
          chapters: [],
         
          }
        }

    async componentDidMount(){
      await this.getToken()
      this.showDetails()
    }

    async getToken () {
      await AsyncStorage.getItem('token').then(key=>
        this.setState({
          token: key
        }))
    }


    showDetails = () => {
      axios({
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${this.state.token}`
        },
        url: `${config.API_URL}/sketch/${this.state.skId}/chapter/${this.state.chId}`
      }).then(res => {
        const chapters = res.data
        console.log(chapters)
        this.setState({chapters})
      })
    }

    static navigationOptions = ({ navigation }) => {
      return {
        title: navigation.getParam('title'),
        headerStyle: {
            backgroundColor: '#32cd32',
          },
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        headerRight: (
            <Icon type="FontAwesome" name="share-alt" style={styles.Share}  
            onPress = {() => Share.share({message:"share kewibuanmu"})}
            />
          ),
        };
    }

    render(){    
      return(
        <Container>
        <Content style={styles.Content} >
       
        <View style={styles.AllCon}> 
            <FlatList
              data = {this.state.chapters}
              keyExtractor = {item => item.id}
              renderItem = {({item}) => 
              <View key={item.image}>
                  <Image style={styles.AllImg} source={{ uri: item.image }} />
              </View>
            }/>                          
        </View>
        </Content>   
      </Container>
      )
    }
  }

  const styles = StyleSheet.create({
    Share: {
      marginRight:20},
    Content: {
      paddingVertical: 20},
    AllCon: {
      margin: 15, 
      marginTop: 0},
    AllImg: { 
      width: 380, 
      height: 500, 
      }
  })