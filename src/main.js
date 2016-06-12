import style from './assets/css/application.css'

import Vue from 'vue'
import Resource from 'vue-resource'
import Router from 'vue-router'

import Application from './components/application/Application'
import Home from './components/home/Home'
import About from './components/about/About'

Vue.use(Router);
Vue.use(Resource);

var router = new Router();

router.map({
    '/home': {
        name: 'home',
        component: Home
    },
    '/about': {
        name: 'about',
        component: About
    }
});

router.redirect({
    '*': '/home'
});

router.start(Application, 'application');
