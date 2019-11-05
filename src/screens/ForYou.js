import React, {Component} from 'react';
import {
  Container,
  Content,
  View,
  Text,
  Item,
  Input,
  Button,
  Header,
  Row,
  Icon,
} from 'native-base';
import {StyleSheet, ScrollView, Dimensions, Image} from 'react-native';
import Carousel from 'react-native-banner-carousel';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {connect} from 'react-redux';
import * as act from '../_actions/sketch';

import config from '../../config-env';

class ForYou extends Component {
  BannerWidth = Dimensions.get('window').width;
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      fav: [],
      keyword: '',
      id: null,
    };
  }

  async componentDidMount() {
    await this.getToken();
    await this.getId();
    this.showFavorite();
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
    this.props.getAllSketch();
    console.log(config.API_URL, '>>>>>>>>>>>>>>>>>>');
  };

  showFavorite = () => {
    this.props.getFav((id = this.state.id), (token = this.state.token));
    this.setState({
      fav: this.props.favorite.favorite.map(res => res.sketch_id),
    });
    this.showSketches();

    console.log(this.props.favorite.favorite, '?????????????');
  };

  createFav = id => {
    axios({
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.state.token}`,
      },
      url: `${config.API_URL}/user/${this.state.id}/favorite`,
      data: {
        sketch_id: id,
      },
    }).then(res => {
      this.showFavorite();
    });
  };

  deleteFav = id => {
    axios({
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.state.token}`,
      },
      url: `${config.API_URL}/user/${this.state.id}/favorite`,
      data: {
        sketch_id: id,
      },
    }).then(res => {
      this.showFavorite();
    });
  };

  render() {
    const {sketch, favorite} = this.props;

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
                this.props.navigation.navigate('SearchWebtoon', {
                  keyword: this.state.keyword,
                })
              }
            />
          </Item>
        </Header>

        <Content style={styles.Content}>
          <View>
            <Carousel
              autoplay
              autoplayTimeout={5000}
              loop
              pageSize={this.BannerWidth}>
              {sketch.sketch.map(image => (
                <View style={styles.Carousel}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('DetailWebtoon', {
                        detail: image.image,
                        title: image.title,
                        skId: image.id,
                      })
                    }>
                    <Image
                      style={styles.CarouselImg}
                      source={{uri: image.image}}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </Carousel>
          </View>

          <View style={styles.ScrollView}>
            <Text style={styles.Fav}>Favourite</Text>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal={true}>
              {favorite.favorite.map(image => (
                <View style={styles.ScrollViewCon}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('DetailWebtoon', {
                        detail: image.sketchId.image,
                        title: image.sketchId.title,
                        skId: image.sketchId.id,
                      })
                    }>
                    <Image
                      style={styles.ScrollViewImg}
                      source={{uri: image.sketchId.image}}
                    />
                    <Text>{image.sketchId.title}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={styles.AllCon}>
            <Text style={styles.All}>All Comics</Text>
            {sketch.sketch.map(image => (
              <View style={styles.AllCont}>
                <Row>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('DetailWebtoon', {
                        detail: image.image,
                        title: image.title,
                        skId: image.id,
                      })
                    }>
                    <Image style={styles.AllImg} source={{uri: image.image}} />
                  </TouchableOpacity>
                  <View style={styles.AllDes}>
                    <Text style={styles.AllTitle}>{image.title}</Text>
                    <Row>
                      {this.state.fav.includes(image.id) ? (
                        <Button
                          succes
                          small
                          style={styles.AllButton}
                          onPress={() => this.deleteFav(image.id)}
                          disabled={this.state.isFavBtn}>
                          <Text style={styles.AllFav}>Favorites</Text>
                        </Button>
                      ) : (
                        <Button
                          dark
                          small
                          style={styles.AllButton}
                          onPress={() => this.createFav(image.id)}
                          disabled={this.state.isFavBtn}>
                          <Text style={styles.AllFav}>Add Favorite</Text>
                        </Button>
                      )}
                    </Row>
                  </View>
                </Row>
              </View>
            ))}
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    sketch: state.sketch,
    favorite: state.favorite,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllSketch: () => dispatch(act.getAllSketch()),
    getFav: (id, token) => dispatch(act.getFav(id, token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForYou);

const styles = StyleSheet.create({
  Header: {
    backgroundColor: '#4e62cf',
  },
  HeaderIcon: {
    paddingRight: 17,
    fontSize: 30,
  },
  Content: {paddingVertical: 5},
  Carousel: {
    flex: 1,
    alignSelf: 'center',
  },
  CarouselImg: {
    width: 400,
    height: 280,
    borderWidth: 1,
    borderColor: 'black',
  },
  ScrollView: {
    margin: 15,
  },
  Fav: {
    marginBottom: 7,
    fontWeight: 'bold',
    fontSize: 20,
  },
  ScrollViewCon: {
    flex: 1,
    marginRight: 8,
    alignSelf: 'center',
    width: 150,
  },
  ScrollViewImg: {
    width: 150,
    borderWidth: 1,
    borderColor: 'black',
    height: 150,
    marginBottom: 5,
  },
  AllCon: {
    margin: 20,
    marginTop: 0,
  },
  All: {
    marginBottom: 7,
    fontWeight: 'bold',
    fontSize: 20,
  },
  AllCont: {
    marginBottom: 15,
  },
  AllImg: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: 'black',
  },
  AllDes: {
    marginLeft: 15,
    flex: 1,
    justifyContent: 'center',
  },
  AllTitle: {
    marginBottom: 5,
  },
  AllButton: {
    width: 130,
  },
  AllFav: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
});
