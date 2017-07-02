import { _ } from 'lodash';
import {
  FlatList,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import randomColor from 'randomcolor';
import { graphql, compose } from 'react-apollo';

import Message from '../components/Message';
import MessageInput from '../components/MessageInput';
import { GROUP_QUERY } from '../graphql/group.query';
import { CREATE_MESSAGE_MUTATION } from '../graphql/create-message.mutation';

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    backgroundColor: '#e5ddd5',
    flex: 1,
    flexDirection: 'column',
  },
  loading: {
    justifyContent: 'center',
  },
});

const fakeData = () => _.times(100, i => ({
  // every message will have a different color
  color: randomColor(),
  // every 5th message will look like it's from the current user
  isCurrentUser: i % 5 === 0,
  message: {
    id: i,
    createdAt: new Date().toISOString(),
    from: {
      username: `Username ${i}`,
    },
    text: `Message ${i}`,
  },
}));

function isDuplicateMessage(newMessage, existingMessages) {
  return newMessage.id !== null &&
    existingMessages.some(message => newMessage.id === message.id);
}

class Messages extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      title: state.params.title,
    };
  };
  state = {
    usernameColors: {}
  }
  componentWillReceiveProps(nextProps) {
    const usernameColors = {};
    // check for new messages
    if (nextProps.group) {
      if (nextProps.group.users) {
        // apply a color to each user
        nextProps.group.users.forEach((user) => {
          usernameColors[user.username] = this.state.usernameColors[user.username] || randomColor();
        });
      }
      this.setState({
        usernameColors,
      });
    }
  }

  _onContentSizeChange = (w, h) => {
    if (this.state.shouldScrollToBottom && this.state.height < h) {
      this.listView.scrollToEnd({ animated: true });
    } else if (this.state.shouldScrollToBottom) {
      this.setState({
        shouldScrollToBottom: false,
      });
    }
  }

  _onLayout = e => {
    const { height } = e.nativeEvent.layout;
    this.setState({ height });
  }

  _send = text => {
    this.props.createMessage({
      groupId: this.props.navigation.state.params.groupId,
      userId: 1,
      text
    }).then(() => {
      this.listView.scrollToEnd({ animated: true });
      this.setState({
        shouldScrollToBottom: true,
      })
    })
  }

  keyExtractor = item => item.id;
  renderItem = ({ item: message }) => (
    <Message
      color={this.state.usernameColors[message.from.username]}
      isCurrentUser={message.from.id === 1}
      message={message}
    />
  );

  render() {
    const { loading, group } = this.props;
    if (loading && !group) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="position"
        contentContainerStyle={styles.container}
        keyboardVerticalOffset={64}
      >
        <FlatList
          ref={(ref) => { this.listView = ref; }}
          data={group.messages.slice().reverse()}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onContentSizeChange={this.onContentSizeChange}
          onLayout={this.onLayout}
        />
        <MessageInput send={this._send} />
      </KeyboardAvoidingView>
    );
  }
}

const groupQuery = graphql(GROUP_QUERY, {
  options: ownProps => ({
    variables: {
      groupId: ownProps.navigation.state.params.groupId,
    },
  }),
  props: ({ data: { loading, group } }) => ({
    loading, group,
  }),
});

const createMessageMutation = graphql(CREATE_MESSAGE_MUTATION, {
  props: ({ mutate }) => ({
    createMessage: ({ text, userId, groupId }) => mutate({
      variables: { text, userId, groupId },
      optimisticResponse: {
        __typename: 'Mutation',
        createMessage: {
          __typename: 'Message',
          id: -1,
          text,
          createdAt: new Date().toISOString(),
          from: {
            __typename: 'User',
            id: 1,
            username: 'Justyn.Kautzer'
          },
          to: {
            __typename: 'Group',
            id: groupId
          },
        },
      },
      update: (store, { data: { createMessage } }) => {
        const data = store.readQuery({
          query: GROUP_QUERY,
          variables: {
            groupId,
          },
        });

        if (isDuplicateMessage(createMessage, data.group.messages)) {
          return data;
        }

        // add our message from the mutation to the end.
        data.group.messages.unshift(createMessage);

        // write our data back to the cache.

        store.writeQuery({
          query: GROUP_QUERY,
          variables: {
            groupId,
          },
          data,
        });
      },
    })
  })
});

export default compose(
  groupQuery,
  createMessageMutation
)(Messages);