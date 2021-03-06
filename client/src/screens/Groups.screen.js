import { _ } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableHighlight,
  View,
  Button,
  Image
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

import { USER_QUERY } from '../graphql/user.query';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  loading: {
    justifyContent: 'center',
    flex: 1,
  },
  groupContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  groupName: {
    fontWeight: 'bold',
    flex: 0.7,
  },
  groupTextContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 6,
  },
  groupText: {
    color: '#8c8c8c',
  },
  groupImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  groupTitleContainer: {
    flexDirection: 'row',
  },
  groupLastUpdated: {
    flex: 0.3,
    color: '#8c8c8c',
    fontSize: 11,
    textAlign: 'right',
  },
  groupUsername: {
    paddingVertical: 4,
  },
  header: {
    alignItems: 'flex-end',
    padding: 6,
    borderColor: '#eee',
    borderBottomWidth: 1,
  },
  warning: {
    textAlign: 'center',
    padding: 12,
  },
});
// create fake data to populate our ListView
const fakeData = () =>
  _.times(100, i => ({
    id: i,
    name: `Group ${i}`,
  }));

const formatCreatedAt = createdAt => moment(createdAt).calendar(null, {
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: 'dddd',
  sameElse: 'DD/MM/YYYY',
});

const Header = ({ onPress }) => (
  <View style={styles.header}>
    <Button title="New Group" onPress={onPress} />
  </View>
);

Header.propTypes = {
  onPress: PropTypes.func.isRequired,
};

class Group extends Component {
  render() {
    const { id, name, messages } = this.props.group;
    return (
      <TouchableHighlight key={id} onPress={this.props.goToMessages}>
        <View style={styles.groupContainer}>
          <Image
            style={styles.groupImage}
            source={{
              uri: 'https://facebook.github.io/react/img/logo_og.png'
            }}
          />
          <View style={styles.groupTextContainer}>
            <View style={styles.groupTitleContainer}>
              <Text style={styles.groupName}>{`${name}`}</Text>
              <Text style={styles.groupLastUpdated}>
                {messages.length ?
                   formatCreatedAt(messages[0].createdAt) : ''}
              </Text>
            </View>
            <Text style={styles.groupUsername}>
              {messages.length ?
                  `${messages[0].from.username}:` : ''}
            </Text>
            <Text style={styles.groupText} numberOfLines={1}>
              {messages.length ? messages[0].text : ''}
            </Text>
          </View>
          <Icon
            name="angle-right"
            size={24}
            color={'#8c8c8c'}
          />
        </View>
      </TouchableHighlight>
    );
  }
}

Group.propTypes = {
  goToMessages: PropTypes.func.isRequired,
  group: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};

class Groups extends Component {
  static navigationOptions = {
    title: 'Chats',
  };

  _goToMessages = group => {
    console.log('====================================');
    console.log('hello');
    console.log('====================================');
    const { navigate } = this.props.navigation;
    // groupId and title will attach to
    // props.navigation.state.params in Messages
    navigate('Messages', { groupId: group.id, title: group.name });
  };

  _goToNewGroup = () => {
    const { navigate } = this.props.navigation;
    navigate('NewGroup');
  };

  _onRefresh = () => {
    this.props.refetch();
  }

  keyExtractor = item => item.id;
  renderItem = ({ item }) => (
    <Group group={item} goToMessages={() => this._goToMessages(item)} />
  );
  render() {
    console.log('====================================');
    console.log(this.props);
    console.log('====================================');
    const { loading, user, networkStatus } = this.props;

    if (loading) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    if (user && !user.groups.length) {
      return (
        <View style={styles.container}>
          <Header onPress={this.goToNewGroup} />
          <Text style={styles.warning}>You do not have any groups.</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={user.groups}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ListHeaderComponent={() => <Header onPress={this._goToNewGroup} />}
          onRefresh={this._onRefresh}
          refreshing={networkStatus === 4}
        />
      </View>
    );
  }
}

const userQuery = graphql(USER_QUERY, {
  options: () => ({ variables: { id: 1 } }),
  props: ({ data: { loading, user, networkStatus, refetch } }) => ({
    loading,
    user,
    networkStatus,
    refetch
  }),
});

export default userQuery(Groups);
