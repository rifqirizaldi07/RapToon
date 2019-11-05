import React from 'react';
import {
  Image,
  PixelRatio,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native';
import {Container, Content, Icon} from 'native-base';
import ImagePicker from 'react-native-image-picker';
import config from '../../config-env';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import axios from 'axios';
import * as act from '../_actions/user';

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarSource: '',
      username: '',
      id: null,
      token: null,
    };

    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }

  async componentDidMount() {
    await this.getToken();
    await this.getId();
    this.showUser();
    this.props.navigation.setParams({editAndBack: this.editAndBack});
  }

  async getToken() {
    const getToken = await AsyncStorage.getItem('token');
    if (getToken !== null) {
      this.setState({
        token: getToken,
      });
    } else {
      alert('You Must Login to access this screen');
      this.props.navigation.navigate('Login');
    }
  }

  async getId() {
    await AsyncStorage.getItem('id').then(key =>
      this.setState({
        id: JSON.parse(key),
      }),
    );
  }

  showUser = () => {
    this.props.getUser((id = this.state.id), (token = this.state.token));
    this.setState({
      username: this.props.user.user.username,
      avatarSource: {uri: this.props.user.user.image},
    });
  };

  editAndBack = () => {
    axios({
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.state.token}`,
      },
      url: `${config.API_URL}/user/${this.state.id}`,
      data: this.createFormData(this.state.avatarSource, {
        username: this.state.username,
      }),
    }).then(res => {
      this.props.navigation.navigate('Profile');
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

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Edit Profile',
      headerStyle: {
        backgroundColor: '#4e62cf2',
      },
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: (
        <Icon
          type="Entypo"
          name="check"
          style={styles.BBIcon}
          onPress={navigation.getParam('editAndBack')}
        />
      ),
    };
  };

  render() {
    const {user} = this.props;

    return (
      <Container>
        <Content>
          <View style={styles.container}>
            <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
              <View style={[styles.avatar, styles.avatarContainer]}>
                <Image style={styles.avatar} source={this.state.avatarSource} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            <TextInput
              ref={ref => (this.textInputRef = ref)}
              placeholder="Username"
              onChangeText={username => this.setState({username})}
              value={this.state.username}
              style={styles.textInputStyle}
            />
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUser: (id, token) => dispatch(act.getUser(id, token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditProfile);

const styles = StyleSheet.create({
  Header: {
    backgroundColor: 'limegreen',
  },
  BB: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 21,
  },
  BBIcon: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 29,
    marginRight: 20,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 100,
    borderColor: 'black',
    borderWidth: 2,
    width: 200,
    height: 200,
  },
  textInputStyle: {
    textAlign: 'center',
    height: 40,
    width: '80%',
    fontSize: 17,
    borderWidth: 1,
    borderColor: 'black',
    color: 'black',
    borderRadius: 7,
    marginTop: 5,
    marginHorizontal: 2,
  },
});
