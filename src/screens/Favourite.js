import React, {Component} from 'react';
import {
  Container,
  Content,
  View,
  Text,
  Item,
  Input,
  Header,
  Row,
  Icon,
} from 'native-base';
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {connect} from 'react-redux';
import * as act from '../_actions/sketch';

class Fav extends Component {
  constructor() {
    super();
    this.state = {
      id: null,
      favorites: [],
      keyword: '',
      token: null,
    };
  }

  async componentDidMount() {
    await this.getToken();
    await this.getId();
    this.showFavorite();
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

  showFavorite = () => {
    this.props.getFav((id = this.state.id), (token = this.state.token));
  };

  render() {
    const {favorite} = this.props;

    return (
      <Container>
        <Header searchBar rounded style={styles.Header}>
          <Item rounded>
            <Input
              placeholder="Search"
              onChangeText={keyword => this.setState({keyword})}
            />
            <Icon
              name="search"
              style={styles.HeaderIcon}
              onPress={() =>
                this.props.navigation.navigate('SearchFavorite', {
                  keyword: this.state.keyword,
                })
              }
            />
          </Item>
        </Header>
        <Content style={styles.Content}>
          <View style={styles.AllCon}>
            <FlatList
              data={favorite.favorite}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <View style={styles.AllCont} key={item.image}>
                  <Row>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('DetailWebtoon', {
                          detail: item.sketchId.image,
                          title: item.sketchId.title,
                          skId: item.sketchId.id,
                        })
                      }>
                      <Image
                        style={styles.AllImg}
                        source={{uri: item.sketchId.image}}
                      />
                    </TouchableOpacity>

                    <View style={styles.AllDes}>
                      <Text style={styles.AllTitle}>{item.sketchId.title}</Text>
                      <Text style={styles.AllStar}>{item.sketchId.genre}</Text>
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

const mapStateToProps = state => {
  return {
    favorite: state.favorite,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getFav: (id, token) => dispatch(act.getFav(id, token)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Fav);

const styles = StyleSheet.create({
  Header: {
    backgroundColor: '#4e62cf',
  },
  HeaderIcon: {
    paddingRight: 17,
    fontSize: 30,
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
