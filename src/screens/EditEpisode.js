import React, { Component } from 'react';
import { View, StyleSheet, PixelRatio, FlatList, Image,TouchableOpacity } from 'react-native';
import {
    Container, 
    Content, 
    Text,
    Row,
    Button, 
    Icon,  
    } 
    from 'native-base';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import ImagePicker from 'react-native-image-picker';
import config from '../../config-env'

export default class CreateEpisode extends Component {

constructor(props){
    super(props);
    this.state = {
      id: null,
      token: '',
      avatarSource: '',
      chTitle: this.props.navigation.getParam('chTitle'),
      image: this.props.navigation.getParam('chImage'),
      skId: this.props.navigation.getParam('skId'),
      chId: this.props.navigation.getParam('chId'),
      pages: [],
      photo: ''
      }
      this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
    }

async componentDidMount(){
  await this.getToken()
  await this.getId()
  this.showDetails()
  // this.focusListener = this.props.navigation.addListener('didFocus', () => {
  //   this.showDetails()
  // })
  this.props.navigation.setParams({ editChapter: this.editChapter})
  
}

async getId () {
  await AsyncStorage.getItem('id').then(key=>
    this.setState({
      id: JSON.parse(key)
    }))
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
    url: `${config.API_URL}/user/${this.state.id}/sketch/${this.state.skId}/chapter/${this.state.chId}`
  }).then(res => {
    const pages = res.data
    this.setState({pages})
  })
}

editChapter = () => {
  axios({
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${this.state.token}`
    },
    url: `${config.API_URL}/user/${this.state.id}/sketch/${this.state.skId}/chapter/${this.state.chId}`,
    data: this.createFormData(this.state.avatarSource,
    {
      chapter_title: this.state.chTitle,
    })
  }).then(res => {
    this.props.navigation.navigate('EditWebtoon')
  })
}

deleteChapter = () => {
  axios({
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${this.state.token}`
    },
    url: `${config.API_URL}/user/${this.state.id}/sketch/${this.state.skId}/chapter/${this.state.chId}`,
  }).then(res => {
    this.props.navigation.navigate('EditWebtoon')
  })
  this.showDetails()
}

deletePage = (id) => {
  axios({
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${this.state.token}`
    },
    url: `${config.API_URL}/user/${this.state.id}/sketch/${this.state.skId}/chapter/${this.state.chId}/image/${id}`,
  })
  this.showDetails()
}

createFormData = (photo, body) => {
  const data = new FormData();

  data.append("photo", {
    name: photo.fileName,
    type: photo.type,
    uri: photo.uri
      
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });

  return data;
};

choosePhoto = () => {
  const options = {
    noData: true,
  }
  ImagePicker.launchImageLibrary(options, response => {
    if (response.uri) {
      this.setState({ photo: response })
      this.handleUploadPhoto()
    }
  })
}

handleUploadPhoto = () => {
  
  axios({
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${this.state.token}`
    },
    url: `${config.API_URL}/user/${this.state.id}/sketch/${this.state.skId}/chapter/${this.state.chId}/image`,
    data: this.createFormData(this.state.photo, { })
  })
    .then(response => {
      console.log("upload succes", response);
      this.setState({ photo: '' });
      this.showDetails()
    })
    .catch(error => {
      console.log("upload error", error);
      alert("Upload failed!");
    });
}


static navigationOptions = ({ navigation }) => {
  return {
    title: "Edit Chapter",
    headerStyle: {
      backgroundColor: '#32cd32',
      },
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerRight: (
      <Icon type="Entypo" name='check' style={styles.BBIcon} 
      onPress = {navigation.getParam('editChapter')}
      />
      ),
    };
  }

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };
  
  ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        if (response.uri) {
          this.setState({ avatarSource: response })
          console.log(this.state.avatarSource)
        }     
      }
    });
  }


render() {
    return (
        <Container>
        <Content style={{flex: 1, margin:15}}>
        <Text style={{fontSize: 20,fontWeight: 'bold', marginVertical: 7}}>Chapter Title</Text>
        <TextInput
         placeholder='Chapter Title'
         value= {this.state.chTitle}
         onChangeText={chTitle => this.setState({ chTitle })}
        style= {{borderWidth: 2, borderColor: 'black', fontSize:20, borderRadius: 100, textAlign:'center'}}
        />
        <Text style={{fontSize: 20,fontWeight: 'bold', marginBottom: 7, marginTop: 7}}>Change Cover Page</Text>
        <View style={styles.BannerContainer}>
          <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
            <View
                style={[styles.avatar, styles.avatarContainer]}>
                {this.state.avatarSource === '' ? (
                <Image style={styles.avatar} source={{uri: this.state.image}} />
                ) : (
                <Image style={styles.avatar} source={this.state.avatarSource} />
                )}
                
            </View>
          </TouchableOpacity>
        </View>

        <Text style={{fontSize: 20,fontWeight: 'bold', marginTop: 7, marginBottom: 7}}>Add Images</Text>
        <FlatList
            data = {this.state.pages}
            keyExtractor = {item => item.id}
            renderItem = {({item}) => 
            <View style={styles.AllCont} key={item.image}>
            <Row>
                <Image 
                style={styles.AllImg} 
                source={{ uri: item.image }} 
                />
                <View style={styles.AllDes}>
                {/* <Text style={styles.AllEp}>{item.id}</Text> */}
                <Button onPress = {() => this.deletePage(item.id)} style={styles.AllButton}>
                   <Text style={styles.AllFav}>Delete</Text>
                </Button>
                </View>
            </Row>
            </View>
        }/>                                  
        
        <Button block rounded  style={{alignSelf: 'center', marginTop: 15}} 
        onPress = {()=>this.choosePhoto()}
        >
        <Text style={{fontSize:17}} >+ Add Image</Text>
        </Button>
        <Button block danger rounded style={{alignSelf: 'center', marginTop: 15}} 
        onPress={() => this.deleteChapter()}
        >
        <Text style={{fontSize:17}} >DELETE CHAPTER</Text>
        </Button>   
       
        </Content>
        </Container>
    );
  }
}

const styles = StyleSheet.create({
    BBIcon: {
      fontWeight: 'bold',
      color: 'black',
      fontSize: 29,
      marginRight: 20
    },
    AllCont: {
      marginBottom:15},
    AllImg: { 
      width: 150, 
      height: 150, 
      borderWidth: 2, 
      borderColor:'black', },
    AllDes: {
      marginLeft: 15, 
      flex:1, 
      justifyContent:'space-around'},
    AllEp: {
      marginBottom: 10,
      fontSize: 20,
      fontWeight:'bold' },
    AllFav: {
      fontSize:15,
      color:'white', 
      fontWeight: 'bold'},
    AllButton: {
      justifyContent: 'center',
      width:110, 
      backgroundColor: '#bb2124'},
    BannerContainer: {
      flex: 1,
      alignItems: 'center',},
    avatarContainer: {
      borderColor: '#9B9B9B',
      borderWidth: 1 / PixelRatio.get(),
      justifyContent: 'center',
      alignItems: 'center',},
    avatar: {
      borderColor: 'black',
      borderWidth: 2,
      width: 150,
      height: 150,},
})
