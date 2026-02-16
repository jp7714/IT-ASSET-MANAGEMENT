import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import AssetsView from '../views/AssetsView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import AssignmentsView from '../views/AssignmentsView.vue'
import MainLayout from '../layouts/MainLayout.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/',
            component: MainLayout,
            redirect: '/dashboard',
            children: [
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: DashboardView
                },
                {
                    path: 'assets',
                    name: 'assets',
                    component: AssetsView
                },
                {
                    path: 'categories',
                    name: 'categories',
                    component: CategoriesView
                },
                {
                    path: 'assignments',
                    name: 'assignments',
                    component: AssignmentsView
                }
            ]
        }
    ]
})

export default router
