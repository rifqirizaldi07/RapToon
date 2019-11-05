import React, {Component} from 'react';
import {Container, Content, View, Text, Row, Fab, Icon} from 'native-base';
import {StyleSheet, FlatList, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import config from '../../config-env';

export default class MyCreation extends Component {
  constructor() {
    super();
    this.state = {
      active: false,
      sketches: [],
      token: '',
      id: null,
    };
  }

  async componentDidMount() {
    await this.getToken();
    await this.getId();
    this.showSketches();
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.showSketches();
    });
  }

  async getToken() {
    await AsyncStorage.getItem('token').then(key =>
      this.setState({
        token: key,
      }),
    );
  }

  async getId() {
    await AsyncStorage.getItem('id').then(key =>
      this.setState({
        id: JSON.parse(key),
      }),
    );
  }

  showSketches = () => {
    axios({
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.state.token}`,
      },
      url: `${config.API_URL}/user/${this.state.id}/sketches`,
    }).then(res => {
      const sketches = res.data;

      console.log(sketches);
      this.setState({sketches});
    });
  };

  // static navigationOptions = ({navigation}) => {
  //   return {
  //     title: 'My Creation',
  //     headerStyle: {
  //       backgroundColor: '#4e62cf',
  //     },
  //     headerTitleStyle: {
  //       fontWeight: 'bold',
  //     },
  //   };
  // };

  render() {
    return (
      <Container>
        <View style={{flex: 1}}>
          <Fab style={{backgroundColor: '#4e62cf'}} position="bottomRight">
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('CreateWebtoon')}>
              <Icon
                type="FontAwesome"
                name="plus"
                style={{fontSize: 35, color: 'white'}}
              />
            </TouchableOpacity>
          </Fab>
          <Content style={styles.Content}>
            <View style={styles.AllCon}>
              <FlatList
                data={this.state.sketches}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <View style={styles.AllCont} key={item.image}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('EditWebtoon', {
                          title: item.title,
                          skId: item.id,
                          genre: item.genre,
                          image: item.image,
                        })
                      }>
                      <Row>
                        <Image
                          style={styles.AllImg}
                          source={{uri: item.image}}
                        />
                        <View style={styles.AllDes}>
                          <Text style={styles.AllTitle}>{item.title}</Text>
                          <Text style={styles.AllStar}>{item.genre}</Text>
                        </View>
                      </Row>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </Content>
        </View>
      </Container>
    );
  }
}

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
    fontSize: 24,
    marginRight: 20,
  },
  Content: {
    paddingVertical: 20,
  },
  AllCon: {
    margin: 15,
    marginTop: 0,
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
  AllTitle: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  AllStar: {
    marginBottom: 5,
    fontSize: 13,
  },
});
