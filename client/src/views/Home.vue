
<template>
    <div>
        <div>
            <navbar></navbar>
        </div>
        <div class="columns is-mobile">
            <div
                class="column is-one-fifth-desktop is-one-third-tablet is-one-fifth-mobile"
            >
                <sidebar> </sidebar>
            </div>
            <div class="column">
                <weather-service v-if="$store.getters.routeWeather">
                </weather-service>
                <finance-service
                    v-if="$store.getters.routeFinance"
                ></finance-service>
                <dofus-service v-if="$store.getters.routeDofus"></dofus-service>
                <div v-if="isServices" class="mt-6">
                    <no-services></no-services>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import Services from '@/services/Services.js';
import WeatherService from './WeatherService.vue';
import Navbar from '../components/Navbar.vue';
import NoServices from '../components/NoServices.vue';
import FinanceService from './FinanceService.vue';
import DofusService from './DofusService.vue';

export default {
    /* eslint-disable vue/no-unused-components */
    name: 'Home',

    components: {
        Sidebar,
        NoServices,
        WeatherService,
        Navbar,
        FinanceService,
        DofusService,
    },

    data: function () {
        return {
            reload: 1,
            isServices: false,
        };
    },

    methods: {
        reloadComponent: function () {
            this.reload++;
        },
    },

    mounted() {
        Services.getActiveServices().then((response) => {
            let servicesCount = 0;

            for (const [, element] of Object.entries(response.data)) {
                if (element == false) servicesCount++;
            }
            if (servicesCount == Object.keys(response.data).length) {
                this.isServices = true;
            }
        });
    },
};
</script>

<style scoped>
</style>