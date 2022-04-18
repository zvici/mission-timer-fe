export default [
  {
    title: 'Home',
    route: 'home',
    icon: 'HomeIcon',
  },
  {
    title: 'Hoạt động',
    icon: 'CalendarIcon',
    children: [
      {
        title: 'Nội dung',
        route: 'content-page',
        icon: 'SunIcon',
      },
    ],
  },
  {
    title: 'Năm học',
    route: 'years-page',
    icon: 'SunIcon',
  },
  {
    title: 'Người dùng',
    route: 'users-page',
    icon: 'UsersIcon',
  },
]
