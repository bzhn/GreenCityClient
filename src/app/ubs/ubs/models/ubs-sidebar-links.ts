import { listElements } from 'src/app/shared/interface/ubs-base-sidebar-interface';

export const listElementsAdmin: listElements[] = [
  {
    link: 'assets/img/sidebarIcons/shopping-cart_icon.svg',
    name: 'ubs-sidebar.orders',
    routerLink: 'orders'
  },
  {
    link: 'assets/img/sidebarIcons/user_icon.svg',
    name: 'ubs-sidebar.customers',
    routerLink: 'customers'
  },
  {
    link: './assets/img/sidebarIcons/achievement_icon.svg',
    name: 'ubs-sidebar.certificates',
    routerLink: 'certificates'
  },
  {
    link: 'assets/img/sidebarIcons/workers_icon.svg',
    name: 'ubs-sidebar.employees',
    routerLink: 'employee/1'
  },
  {
    link: 'assets/img/sidebarIcons/statistic_icon.svg',
    name: 'ubs-sidebar.tariffs',
    routerLink: 'tariffs'
  },
  {
    link: 'assets/img/sidebarIcons/none_notification_Bell.svg',
    name: 'ubs-sidebar.notifications',
    routerLink: 'notifications'
  }
];

export const listElementsUser: listElements[] = [
  {
    link: 'assets/img/sidebarIcons/shopping-cart_icon.svg',
    name: 'ubs-user.orders',
    routerLink: 'orders'
  },
  {
    link: './assets/img/sidebarIcons/achievement_icon.svg',
    name: 'ubs-user.invoice',
    routerLink: 'bonuses'
  },
  {
    link: 'assets/img/sidebarIcons/workers_icon.svg',
    name: 'ubs-user.user_data',
    routerLink: 'profile'
  },
  {
    link: 'assets/img/sidebarIcons/none_notification_Bell.svg',
    name: 'ubs-user.messages',
    routerLink: 'messages/1'
  }
];

export const listElementsUserMobile: listElements[] = [
  {
    link: 'assets/img/sidebarIcons/workers_icon.svg',
    name: 'ubs-user.user',
    routerLink: 'profile'
  },
  {
    link: './assets/img/sidebarIcons/achievement_icon.svg',
    name: 'ubs-user.invoice',
    routerLink: 'bonuses'
  },
  {
    link: 'assets/img/sidebarIcons/none_notification_Bell.svg',
    name: 'ubs-user.messages',
    routerLink: 'messages/1'
  },
  {
    link: 'assets/img/sidebarIcons/shopping-cart_icon.svg',
    name: 'ubs-user.orders',
    routerLink: 'orders'
  }
];
