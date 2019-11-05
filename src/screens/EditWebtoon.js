import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  PixelRatio,
  TouchableOpacity,
} from 'react-native';
import {Container, Content, Text, Row, Button, Icon} from 'native-base';
import {TextInput, ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import ImagePicker from 'react-native-image-picker';
import config from '../../config-env';

export default class CreateWebtoon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      token: '',
      skId: this.props.navigation.getParam('skId'),
      image: this.props.navigation.getParam('image'),
      title: this.props.navigation.getParam('title'),
      genre: this.props.navigation.getParam('genre'),
      avatarSource: '',
      details: [],
    };
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }

  async componentDidMount() {
    await this.getToken();
    await this.getId();
    await this.showDetails();
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.showDetails();
    });
    this.props.navigation.setParams({editAndBack: this.editAndBack});
  }

  async getId() {
    await AsyncStorage.getItem('id').then(key =>
      this.setState({
        id: JSON.parse(key),
      }),
    );
  }

  async getToken() {
    await AsyncStorage.getItem('token').then(key =>
      this.setState({
        token: key,
      }),
    );
  }

  editAndBack = () => {
    axios({
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.state.token}`,
      },
      url: `${config.API_URL}/user/${this.state.id}/sketch/${this.state.skId}`,
      data: this.createFormData(this.state.avatarSource, {
        title: this.state.title,
        genre: this.state.genre,
      }),
    }).then(res => {
      this.props.navigation.navigate('MyCreation');
    });
  };

  showDetails = () => {
    axios({
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.state.token}`,
      },
      url: `${config.API_URL}/sketch/${this.state.skId}/chapters`,
    }).then(res => {
      const details = res.data;
      console.log(details);
      this.setState({details});
    });
  };

  deleteSketch = () => {
    axios({
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.state.token}`,
      },
      url: `${config.API_URL}/user/${this.state.id}/sketch/${this.state.skId}`,
    }).then(res => {
      this.props.navigation.navigate('MyCreation');
    });
  };

  // static navigationOptions = ({ navigation }) => {
  //     return {
  //         title: "Edit Sketchtoon",
  //         headerStyle: {
  //             backgroundColor: '#32cd32',
  //             },
  //         headerTitleStyle: {
  //             fontWeight: 'bold',
  //         },
  //         headerRight: (
  //             <Icon type="Entypo" name='check' style={styles.BBIcon}
  //             onPress = {navigation.getParam('editAndBack')}
  //             />
  //             ),
  //         };
  //     }

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
          this.setState({avatarSource: response});
          console.log(this.state.avatarSource);
        }
      }
    });
  }

  createFormData = (photo, body) => {
    const data = new FormData();

    data.append('photo', {
      name: photo.fileName,
      type: photo.type,
      uri: photo.uri,
    });
    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });

    return data;
  };

  render() {
    return (
      <Container>
        <Content style={{flex: 1, marginHorizontal: 15, marginTop: 7}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', marginVertical: 7}}>
            Edit Data
          </Text>
          <TextInput
            placeholder="Title"
            value={this.state.title}
            onChangeText={title => this.setState({title})}
            style={{
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 50,
              fontSize: 20,
              textAlign: 'center',
              marginBottom: 7,
            }}
          />
          <TextInput
            placeholder="Genre"
            value={this.state.genre}
            onChangeText={genre => this.setState({genre})}
            style={{
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 50,
              fontSize: 20,
              textAlign: 'center',
            }}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: 15,
              marginBottom: 5,
            }}>
            Edit Photo
          </Text>
          <View style={styles.BannerContainer}>
            <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
              <View style={[styles.avatar, styles.avatarContainer]}>
                {this.state.avatarSource === '' ? (
                  <Image
                    style={styles.avatar}
                    source={{uri: this.state.image}}
                  />
                ) : (
                  <Image
                    style={styles.avatar}
                    source={this.state.avatarSource}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>

          <Text style={{fontSize: 20, fontWeight: 'bold', marginVertical: 13}}>
            Chapters
          </Text>
          <FlatList
            data={this.state.details}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View style={styles.AllCont} key={item.image}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('EditEpisode', {
                      chTitle: item.chapter_title,
                      chImage: item.image,
                      chId: item.id,
                      skId: this.state.skId,
                    })
                  }>
                  <Row>
                    <Image style={styles.AllImg} source={{uri: item.image}} />
                    <View style={styles.AllDes}>
                      <Text style={styles.AllEp}>{item.chapter_title}</Text>
                      <Text style={styles.AllDate}>{item.sketchId.genre}</Text>
                    </View>
                  </Row>
                </TouchableOpacity>
              </View>
            )}
          />

          <Button
            block
            rounded
            style={{alignSelf: 'center', marginTop: 15}}
            onPress={() =>
              this.props.navigation.navigate('CreateEpisode', {
                skId: this.state.skId,
              })
            }>
            <Text style={{fontSize: 17}}>Add Chapter</Text>
          </Button>
          <Button
            block
            danger
            rounded
            style={{alignSelf: 'center', marginTop: 15, marginBottom: 15}}
            onPress={() => this.deleteSketch()}>
            <Text style={{fontSize: 17}}>DELETE</Text>
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
    marginRight: 20,
  },
  AllCont: {
    marginBottom: 15,
  },
  AllImg: {
    width: 75,
    height: 75,
    borderWidth: 2,
    borderColor: 'black',
  },
  AllDes: {
    marginLeft: 15,
    flex: 1,
    justifyContent: 'center',
  },
  AllEp: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  AllDate: {
    marginBottom: 5,
    fontSize: 13,
  },
  BannerContainer: {
    flex: 1,
    marginBottom: 5,
    alignItems: 'center',
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderColor: 'black',
    borderWidth: 2,
    width: 380,
    height: 250,
  },
});
