import React, {Component} from 'react';
import {
  Container,
  Content,
  View,
  Text,
  Row,
  Left,
  Right,
  Body,
  Title,
  Header,
  Button,
  Icon,
} from 'native-base';
import {StyleSheet, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import * as act from '../_actions/user';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      id: null,
    };
  }

  async componentDidMount() {
    await this.getToken();
    await this.getId();
    this.showUser();
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.showUser();
    });
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
  };

  async logout() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('id');
    this.props.navigation.navigate('Login');
  }

  render() {
    const {user} = this.props;

    return (
      <Container>
        <Header style={styles.Header}>
          <Left></Left>
          <Body>
            <Title style={styles.BB}>Profile</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() =>
                this.props.navigation.navigate('EditProfile', {
                  pic: user.user.image,
                  username: user.user.username,
                })
              }>
              <Icon type="Entypo" name="edit" style={styles.BBIcon} />
            </Button>
          </Right>
        </Header>
        <Content>
          <View style={styles.ImgCont}>
            <Image style={styles.Img} source={{uri: user.user.image}} />
            <Text style={styles.Username}>{user.user.username}</Text>
          </View>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('MyCreation')}>
            <Row style={styles.MyCreation}>
              <Text style={styles.MyCreationText}>My Creation</Text>
              <Icon type="AntDesign" name="right" />
            </Row>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.logout()}>
            <Text style={styles.LogOut}>Log Out</Text>
          </TouchableOpacity>
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
)(Profile);

const styles = StyleSheet.create({
  Header: {
    backgroundColor: '#4e62cf',
  },
  BB: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
  },
  BBIcon: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 24,
  },
  ImgCont: {
    paddingVertical: 50,
  },
  Img: {
    borderWidth: 2,
    borderColor: 'black',
    alignSelf: 'center',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  Username: {
    alignSelf: 'center',
    margin: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  LogOut: {
    padding: 15,
    borderTopWidth: 0.5,
    borderBottomWidth: 1,
    borderColor: '#4e62cf',
    fontSize: 15,
  },
  MyCreationText: {
    fontSize: 15,
  },
  MyCreation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderBottomWidth: 0.5,
    borderColor: '#4e62cf',
  },
});
