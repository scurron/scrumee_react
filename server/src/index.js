const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const { me, signup, login } = require('./auth')

const resolvers = {
  Query: {
    // post
    feed(parent, args, ctx, info) {
      return ctx.db.query.posts({ where: { isPublished: true } }, info)
    },
    drafts(parent, args, ctx, info) {
      return ctx.db.query.posts({ where: { isPublished: false } }, info)
    },
    post(parent, { id }, ctx, info) {
      return ctx.db.query.post({ where: { id: id } }, info)
    },

    // auth
    me,

    // sprint
    sprints(parent, args, ctx, info) {
      return ctx.db.query.sprints({ where: { isEnabled: false } }, info)
    },
    sprint(parent, { id }, ctx, info) {
      return ctx.db.query.sprint({ where: { id: id } }, info)
    },

    // retrospectives
    retrospectives(parent, args, ctx, info) {
      return ctx.db.query.retrospectives({ where: { isEnabled: false } }, info)
    },
    retrospectives(parent, { id }, ctx, info) {
      return ctx.db.query.retrospective({ where: { id: id } }, info)
    }
  },

  // mutations
  Mutation: {
    // post
    createDraft(parent, { title, text }, ctx, info) {
      return ctx.db.mutation.createPost(
        { data: { title, text, isPublished: false } },
        info,
      )
    },
    deletePost(parent, { id }, ctx, info) {
      return ctx.db.mutation.deletePost({where: { id } }, info)
    },
    publish(parent, { id }, ctx, info) {
      return ctx.db.mutation.updatePost(
        {
          where: { id },
          data: { isPublished: true },
        },
        info,
      )
    },

    // auth
    signup,
    login,
    
    // sprint
    createSprint(parent, { title, startsAt, endsAt }, ctx, info) {
      return ctx.db.mutation.createSprint({ data: { title, startsAt, endsAt } }, info)
    },
    deleteSprint(parent, { id: id }, ctx, info) { 
      return ctx.db.mutation.deleteSprint({ where: { id: id } }, info)
    },
    enableSprint(parent, { id: id }, ctx, info) {
      return ctx.db.mutation.updateSprint({ where: { id: id }, data: { isEnabled: false } }, info)
    },

    // retrospective
    createRetrospective(parent, { title }, ctx, info) {
      return ctx.db.mutation.createRetrospective({ data: { title, sprint: { connect: { id: "cjcm5j69x00x801420cd84kqs"}} } }, info)
    },
    deleteRetrospective(parent, { id: id }, ctx, info) { 
      return ctx.db.mutation.deleteRetrospective({ where: { id: id } }, info)
    },
    enableRetrospective(parent, { id: id }, ctx, info) {
      return ctx.db.mutation.updateSprint({ where: { id: id }, data: { isEnabled: false }, }, info)
    },
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'http://localhost:4466/scrumee/dev',
      secret: 'mysecret123',
      debug: true,
    }),
  }),
})

server.start(() => console.log('Server is running on http://localhost:4000'))
