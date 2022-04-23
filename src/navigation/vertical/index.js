export default [
  {
    title: 'Home',
    route: 'home',
    icon: 'HomeIcon',
  },
  {
    title: 'Công tác',
    icon: 'CalendarIcon',
    children: [
      {
        title: 'Công việc',
        route: 'activity-page',
        icon: 'ZapIcon',
      },
      {
        title: 'Chi tiết nội dung',
        route: 'content-detail-page',
        icon: 'BookIcon',
      },
      {
        title: 'Nội dung',
        route: 'content-page',
        icon: 'BookIcon',
      },
    ],
  },
  {
    title: 'Tài khoản',
    icon: 'AlignJustifyIcon',
    children: [
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
    ],
  },
]
