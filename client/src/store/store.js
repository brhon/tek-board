/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        routes: {
            weather: false,
            finance: false,
            dofus: false
        },
        modalServices: false
    },

    mutations: {
        setRoutes(state, value) {
            for (let [key, element] of Object.entries(state.routes)) {
                if (key === value) {
                    state.routes[key] = true;
                } else {
                    state.routes[key] = false;
                }
            }
        },

        setmodalServices(state) {
            state.modalServices = !state.modalServices;
        }
    },

    getters: {
        routeWeather: state => state.routes.weather,
        routeFinance: state => state.routes.finance,
        routeDofus: state => state.routes.dofus,
        modalServices: state => state.modalServices
    }
});
