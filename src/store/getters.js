const getters = {
  sessionId: (state) => state.user.sessionId,
  username: (state) => state.user.username,
  avatar: (state) => state.user.avatar,
  permissions: (state) => state.user.permissions,
  id: (state) => state.user.id,
  userInfo: (state) => state.user.userInfo,

  permission_routes: state => state.permission.routes,
  is_routes: state => state.permission.isRoutes,
  pageLoading: state => state.permission.pageLoading,
  tagsList: (state) => state.permission.tagsList,
}


export default getters
