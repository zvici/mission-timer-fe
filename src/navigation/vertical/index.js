export default [
  {
    title: 'Home',
    route: 'home',
    icon: 'HomeIcon',
  },
  {
    title: 'Người dùng',
    route: 'users-page',
    icon: 'UserIcon',
  },
  {
    title: 'Hoạt động',
    route: 'activity-page',
    icon: 'HomeIcon',
  },
  {
    title: 'Hoạt động',
    icon: 'HomeIcon',
    children: [
      {
        title: 'Loại hoạt động',
        icon: 'UserIcon',
      },
    ],
  },
  {
    title: 'Năm học',
    route: 'years-page',
    icon: 'HomeIcon',
  },
]
