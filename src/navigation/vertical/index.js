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
    title: 'Quản lý',
    icon: 'BookIcon',
    children: [
      {
        title: 'Năm học',
        route: 'years-page',
        icon: 'BookIcon',
      },
      {
        title: 'Học kỳ',
        route: 'semester-page',
        icon: 'BookIcon',
      },
      {
        title: 'Bộ môn',
        route: 'subject-page',
        icon: 'BookIcon',
      },
      {
        title: 'Khoa',
        route: 'department-page',
        icon: 'BookIcon',
      },
    ],
  },
  {
    title: 'Tài khoản',
    icon: 'AlignJustifyIcon',
    children: [
      {
        title: 'Người dùng',
        route: 'users-page',
        icon: 'UsersIcon',
      },
    ],
  },
]
