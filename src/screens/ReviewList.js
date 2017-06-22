import React from 'react';
import {
  ListView,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import _ from 'lodash';
import ReviewService from '../services/ReviewService';
import AppConfig from '../config';


const ListItem = (props) => {
  const listStyle = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 12,
      borderBottomWidth: 1,
      borderColor: 'rgba(204, 204, 204, 0.2)',
    },
  });

  const { item } = props;
  return (
    <View style={listStyle.itemContainer}>
      <View style={{ flexDirection: 'row' }}>
        <Icon name="assignment" size={24} color={AppConfig.primaryColor} />
        <Text style={{ marginLeft: 5 }}>{item.index}</Text>
      </View>
      <Text>{item.plate}</Text>
      <Icon name="done-all" size={24} color={AppConfig.primaryColor} />
      <Text>{moment(item.createdAt).format('hh:mm a')}</Text>
    </View>
  );
};

class ReviewListScreen extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      dataSource: ds.cloneWithRows([]),
      refreshing: true,
    };
  }

  componentDidMount() {
    this.fetchReviews();
  }

  mapReviews(reviews) {
    return _.chain(reviews)
      .map(review => ({
        createdAt: moment(review.createdAt).local(),
        type: review.type,
        plate: review.vehicle.plate,
        name: review.userReview.name,
      }))
      .filter(item => moment(item.createdAt).isSame(moment(), 'day'))
      .sortBy(['createdAt'])
      .map((item, i) => ({ ...item, index: i + 1 }))
      .reverse()
      .value();
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.fetchReviews();
  }

  fetchReviews() {
    const token = this.props.auth().token;
    ReviewService.getAll(token)
      .then(res => res.json())
      .then(this.mapReviews)
      .then((items) => {
        this.setState(prevState => ({
          dataSource: prevState.dataSource.cloneWithRows(items),
          refreshing: false,
        }));
      })
      .catch((err) => {
        this.setState({
          refreshing: false,
        });
        ToastAndroid.show('Problema de conexión', ToastAndroid.SHORT);
      });
  }

  renderReviews() {
    const { refreshing, dataSource } = this.state;
    if (!dataSource.getRowCount() && !refreshing) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="sentiment-dissatisfied" size={100} color="#555" />
          <Text style={styles.emptyText}>Al parecer no has realizado revisiones el día de hoy</Text>
        </View>
      );
    }

    return this.reviewList();
  }

  reviewList() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        enableEmptySections
        renderRow={item => <ListItem item={item} />}
        refreshControl={
          <RefreshControl
            color={'gray'}
            refreshing={this.state.refreshing}
            onRefresh={() => this.onRefresh()}
          />
        }
      />
    );
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        style={styles.scroll}
        showsVerticalScrollIndicator
      >
      {this.renderReviews()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scroll: {
    height: AppConfig.windowHeight - AppConfig.navbarHeight,
    width: AppConfig.windowWidth,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    width: 300,
    textAlign: 'center',
  },
});

export default ReviewListScreen;
