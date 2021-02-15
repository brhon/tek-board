import Vue from 'vue';
import VueRouter from 'vue-router';

import Auth from '@/services/Auth';

/* ---------------------------------- Pages --------------------------------- */

import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Home from '../views/Home.vue';

/* ---------------------------------- Pages --------------------------------- */

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        async beforeEnter(to, from, next) {
            const isAuthentified = await Auth.isAuthentified();
            if (isAuthentified == true) next();
            else next({ name: 'login' });
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        props: true,
        async beforeEnter(to, from, next) {
            const isAuthentified = await Auth.isAuthentified();
            if (isAuthentified == true) next({ name: 'home' });
            else next();
        }
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
        async beforeEnter(to, from, next) {
            const isAuthentified = await Auth.isAuthentified();
            if (isAuthentified == true) next({ name: 'home' });
            else next();
        }
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});
export default router;
