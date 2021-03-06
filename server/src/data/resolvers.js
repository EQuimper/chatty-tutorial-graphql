import GraphQLDate from 'graphql-date';

import { User, Message, Group } from './connectors';

export const Resolvers = {
  Date: GraphQLDate,
  Query: {
    group(_, args) {
      return Group.find({ where: args });
    },
    messages(_, args) {
      return Message.findAll({
        where: args,
        order: [['createdAt', 'DESC']],
      });
    },
    user(_, args) {
      return User.findOne({ where: args });
    },
  },
  Mutation: {
    createMessage(_, { text, userId, groupId }) {
      return Message.create({
        userId,
        text,
        groupId,
      });
    },
  },
  Group: {
    users(group) {
      return group.getUsers();
    },
    messages(group, args) {
      console.log('====================================');
      console.log(args);
      console.log('====================================');
      return Message.findAll({
        where: { groupId: group.id },
        order: [['createdAt', 'DESC']],
        limit: args.limit,
        offset: args.offset,
      });
    },
  },
  Message: {
    to(message) {
      return message.getGroup();
    },
    from(message) {
      return message.getUser();
    },
  },
  User: {
    messages(user) {
      return Message.findAll({
        where: { userId: user.id },
      });
    },
    groups(user) {
      return user.getGroups();
    },
    friends(user) {
      return user.getFriends();
    },
  },
};
