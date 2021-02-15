<template>
    <div class="sidebar-page">
        <section class="sidebar-layout">
            <b-sidebar
                mobile="reduce"
                :expand-on-hover="true"
                :fullheight="true"
                type="is-light"
                :open="true"
            >
                <div class="p-1">
                    <div class="block"></div>
                    <b-menu class="is-custom-mobile">
                        <b-menu-list label="Services" icon="lni-bolt">
                            <b-menu-item
                                class="mt-3"
                                v-for="(service, index) in services"
                                v-bind:key="index"
                                :icon="service.icon"
                                :label="service.name"
                                @click="service.clicked($store)"
                            ></b-menu-item>
                        </b-menu-list>

                        <b-button
                            type="is-info"
                            icon-left="lni-plus"
                            expanded
                            class="mt-3"
                            @click="$store.commit('setmodalServices')"
                            >Enable Services</b-button
                        >
                    </b-menu>
                </div>
                <div
                    :class="[
                        'modal',
                        $store.getters.modalServices ? 'is-active' : '',
                    ]"
                >
                    <div class="modal-background"></div>
                    <div class="modal-card">
                        <header class="modal-card-head">
                            <p class="modal-card-title">Enable services</p>
                            <button
                                class="delete"
                                aria-label="close"
                                @click="$store.commit('setmodalServices')"
                            ></button>
                        </header>
                        <section class="modal-card-body">
                            <div class="ml-6">
                                <p class="mb-4">
                                    Activate and desactivate your services.
                                </p>
                                <div class="field">
                                    <b-switch
                                        :value="activeServices.weather"
                                        type="is-success"
                                        @input="changeActiveServices('weather')"
                                    >
                                        Weather Service
                                    </b-switch>
                                </div>
                                <div class="field">
                                    <b-switch
                                        :value="activeServices.finance"
                                        type="is-success"
                                        @input="changeActiveServices('finance')"
                                    >
                                        Finance Service
                                    </b-switch>
                                </div>
                                <div class="field">
                                    <b-switch
                                        :value="activeServices.dofus"
                                        type="is-success"
                                        @input="changeActiveServices('dofus')"
                                    >
                                        Dofus Service
                                    </b-switch>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </b-sidebar>
        </section>
    </div>
</template>

<script>
import Service from '@/services/Services.js';

export default {
    data() {
        return {
            componentKey: 0,
            services: [],
            activeServices: {
                weather: false,
                finance: false,
                dofus: false,
            },
            modal: false,
        };
    },

    watch: {
        activeServices: {
            handler(value) {
                Service.setServices({ services: value });
                this.services = [];
                if (value.weather) {
                    const weatherService = {
                        id: 1,
                        name: 'Weather Service',
                        icon: 'lni-sun',
                        clicked: function (store) {
                            store.commit('setRoutes', 'weather');
                        },
                    };
                    this.services.push(weatherService);
                }
                if (value.finance) {
                    const financeService = {
                        id: 2,
                        name: 'Finance Service',
                        icon: 'lni-bar-chart',
                        clicked: function (store) {
                            store.commit('setRoutes', 'finance');
                        },
                    };
                    this.services.push(financeService);
                }
                if (value.dofus) {
                    const dofusService = {
                        id: 3,
                        name: 'Dofus Service',
                        icon: 'lni-game',
                        clicked: function (store) {
                            store.commit('setRoutes', 'dofus');
                        },
                    };
                    this.services.push(dofusService);
                }
            },
            deep: true,
        },
    },

    methods: {
        forceRerender() {
            this.componentKey += 1;
        },

        // eslint-disable-next-line no-unused-vars
        changeActiveServices: function (serviceToChange) {
            if (serviceToChange == 'weather')
                this.activeServices.weather = !this.activeServices.weather;
            if (serviceToChange == 'finance')
                this.activeServices.finance = !this.activeServices.finance;
            if (serviceToChange == 'dofus')
                this.activeServices.dofus = !this.activeServices.dofus;
            location.reload();
        },
    },

    mounted() {
        Service.getActiveServices().then((response) => {
            this.activeServices.weather = response.data.weather;
            this.activeServices.finance = response.data.finance;
            this.activeServices.dofus = response.data.dofus;
        });
    },
};
</script>

<style lang="scss">
.p-1 {
    padding: 1em;
}

.sidebar-page {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100%;
    // min-height: 100vh;
    .sidebar-layout {
        display: flex;
        flex-direction: row;
        min-height: 100%;
        // min-height: 100vh;
    }
}
@media screen and (max-width: 1023px) {
    .b-sidebar {
        .sidebar-content {
            &.is-mini-mobile {
                &:not(.is-mini-expand),
                &.is-mini-expand:not(:hover) {
                    .menu-list {
                        li {
                            a {
                                span:nth-child(2) {
                                    display: none;
                                }
                            }
                            ul {
                                padding-left: 0;
                                li {
                                    a {
                                        display: inline-block;
                                    }
                                }
                            }
                        }
                    }
                    .menu-label:not(:last-child) {
                        margin-bottom: 0;
                    }
                }
            }
        }
    }
}
@media screen and (min-width: 1024px) {
    .b-sidebar {
        .sidebar-content {
            &.is-mini {
                &:not(.is-mini-expand),
                &.is-mini-expand:not(:hover) {
                    .menu-list {
                        li {
                            a {
                                span:nth-child(2) {
                                    display: none;
                                }
                            }
                            ul {
                                padding-left: 0;
                                li {
                                    a {
                                        display: inline-block;
                                    }
                                }
                            }
                        }
                    }
                    .menu-label:not(:last-child) {
                        margin-bottom: 0;
                    }
                }
            }
        }
    }
}
</style>