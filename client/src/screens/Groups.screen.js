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
} from 'react-native';
import { graphql, compose } from 'react-apollo';

import { USER_QUERY } from '../graphql/user.query';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
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
  loading: {
    justifyContent: 'center',
    flex: 1,
  },
  groupName: {
    fontWeight: 'bold',
    flex: 0.7,
  },
});
// create fake data to populate our ListView
const fakeData = () =>
  _.times(100, i => ({
    id: i,
    name: `Group ${i}`,
  }));

class Group extends Component {
  render() {
    const { id, name } = this.props.group;
    return (
      <TouchableHighlight key={id} onPress={this.props.goToMessages}>
        <View style={styles.groupContainer}>
          <Text style={styles.groupName}>{`${name}`}</Text>
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
  }

  keyExtractor = item => item.id;
  renderItem = ({ item }) => <Group group={item} goToMessages={() => this._goToMessages(item)} />;
  render() {

    const { loading, user } = this.props;

    if (loading) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    console.log('====================================');
    console.log(this.props);
    console.log('====================================');
    // render list of groups for user
    return (
      <View style={styles.container}>
        <FlatList
          data={user.groups}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const userQuery = graphql(USER_QUERY, {
  options: () => ({ variables: { id: 1 }}),
  props: ({ data: { loading, user }}) => ({
    loading,
    user
  })
});

export default userQuery(Groups);
