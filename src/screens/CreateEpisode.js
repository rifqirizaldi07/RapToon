import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  PixelRatio,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Container, Content, Text, Row, Button, Icon} from 'native-base';
import {TextInput} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import ImagePicker from 'react-native-image-picker';
import config from '../../config-env';

export default class CreateEpisode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      skId: props.navigation.getParam('skId'),
      image: '',
      ch_title: '',
      token: '',
      avatarSource: null,
      photo: '',
    };
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }

  async componentDidMount() {
    await this.getToken();
    await this.getId();
    this.props.navigation.setParams({createChapter: this.createChapter});
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

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Create Chapter',
      headerStyle: {
        backgroundColor: '#4e62cf',
      },
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: (
        <Icon
          type="Entypo"
          name="check"
          style={styles.BBIcon}
          onPress={navigation.getParam('createChapter')}
        />
      ),
    };
  };

  createChapter = () => {
    axios({
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.state.token}`,
      },
      url: `${config.API_URL}/user/${this.state.id}/sketch/${this.state.skId}/chapter`,
      data: this.createFormData(this.state.avatarSource, {
        chapter_title: this.state.ch_title,
        sketch_id: this.state.skId,
        image: this.state.image,
      }),
    }).then(res => {
      this.setState({avatarSource: null});
      this.props.navigation.navigate('MyCreation');
    });
  };

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
        <Content style={{flex: 1, margin: 15}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', marginVertical: 7}}>
            Add Page Title
          </Text>
          <TextInput
            placeholder="Chapter Title"
            onChangeText={ch_title => this.setState({ch_title})}
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
              marginBottom: 7,
              marginTop: 7,
            }}>
            Add Photo
          </Text>
          <View style={styles.BannerContainer}>
            <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
              <View style={[styles.avatar, styles.avatarContainer]}>
                {this.state.avatarSource === null ? (
                  <Image
                    style={styles.avatar}
                    source={require('./blank.jpg')}
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

          <Button
            block
            rounded
            style={{alignSelf: 'center', marginTop: 15}}
            onPress={() => this.createChapter()}>
            <Text style={{fontSize: 17}}>Create </Text>
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
    width: 150,
    height: 150,
    borderWidth: 2,
    borderColor: 'black',
  },
  AllDes: {
    marginLeft: 15,
    flex: 1,
    justifyContent: 'space-around',
  },
  AllEp: {
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  AllFav: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
  },
  AllButton: {
    justifyContent: 'center',
    width: 110,
    backgroundColor: '#bb2124',
  },
  BannerContainer: {
    flex: 1,
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
    width: 150,
    height: 150,
  },
});
