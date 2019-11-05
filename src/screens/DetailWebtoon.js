import React, {Component} from 'react';
import {Container, Content, View, Text, Row, Icon} from 'native-base';
import {StyleSheet, FlatList, Dimensions, Share, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import config from '../../config-env';

export default class DetailWebtoon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      details: [],
      id: props.navigation.getParam('skId'),
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('title'),
      headerStyle: {
        backgroundColor: '#4e62cf',
      },
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: (
        <Icon
          type="FontAwesome"
          name="share-alt"
          style={styles.Share}
          onPress={() => Share.share({message: 'nio comics?'})}
        />
      ),
    };
  };

  async componentDidMount() {
    await this.getToken();
    this.showDetails();
  }

  async getToken() {
    await AsyncStorage.getItem('token').then(key =>
      this.setState({
        token: key,
      }),
    );
  }

  showDetails = () => {
    axios({
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.state.token}`,
      },
      url: `${config.API_URL}/sketch/${this.state.id}/chapters`,
    }).then(res => {
      const details = res.data;
      console.log(details);
      this.setState({details});
    });
  };

  render() {
    return (
      <Container>
        <Content style={styles.Content}>
          <View style={styles.BigPictCon}>
            <Image
              source={{uri: this.props.navigation.getParam('detail')}}
              style={styles.BigPict}
            />
          </View>

          <View style={styles.AllCon}>
            <FlatList
              data={this.state.details}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <View style={styles.AllCont} key={item.image}>
                  <Row>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('DetailEp', {
                          title: item.chapter_title,
                          chId: item.id,
                          skId: item.sketchId.id,
                        })
                      }>
                      <Image style={styles.AllImg} source={{uri: item.image}} />
                    </TouchableOpacity>
                    <View style={styles.AllDes}>
                      <Text style={styles.AllEp}>{item.chapter_title}</Text>
                      <Text style={styles.AllDate}>{item.sketchId.genre}</Text>
                    </View>
                  </Row>
                </View>
              )}
            />
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  Share: {
    marginRight: 20,
    color: 'white',
  },
  Content: {
    paddingVertical: 20,
  },
  BigPictCon: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  BigPict: {
    width: 390,
    borderWidth: 3,
    borderColor: 'black',
    height: 250,
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
  AllEp: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  AllDate: {
    marginBottom: 5,
    fontSize: 13,
  },
});
