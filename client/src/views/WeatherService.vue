<template>
    <section class="mt-6">
        <p class="has-text-weight-semibold mb-2">Add new Widgets:</p>
        <div class="column is-flex is-flex-wrap-wrap mb-6">
            <b-button
                class="is-align-self-flex-start"
                type="is-primary is-light"
                icon-left="lni-flag"
                @click="weatherDynamicData.isActive = true"
                >Dynamic Weather</b-button
            >
            <b-button
                class="is-align-self-flex-start"
                type="is-primary is-light ml-3"
                icon-left="lni-cloudy-sun"
                @click="weatherStaticData.isActive = true"
                >Fixed Weather</b-button
            >
        </div>
        <div class="is-flex is-flex-wrap-wrap">
            <div
                v-for="(widget, index) in widgets"
                v-bind:key="index"
                class="ml-3 mr-3 mt-3"
            >
                <weather-dynamic
                    v-if="widget.widgetName == 'dynamic-weather'"
                    :widgetName="widget.name"
                    :widgetId="widget.id"
                    :fetchWidgets="fetchWidgets"
                ></weather-dynamic>
                <weather-static
                    v-if="widget.widgetName == 'static-weather'"
                    :widgetName="widget.name"
                    :widgetId="widget.id"
                    :fetchWidgets="fetchWidgets"
                    :widgetPlace="widget.place"
                    :widgetTimer="widget.timer"
                ></weather-static>
            </div>
        </div>
        <div :class="['modal', weatherDynamicData.isActive ? 'is-active' : '']">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Widget: Dynamic Weather</p>
                    <button
                        class="delete"
                        aria-label="close"
                        @click="weatherDynamicData.isActive = false"
                    ></button>
                </header>
                <section class="modal-card-body">
                    <p class="mb-4">
                        <strong>Description : </strong> This widget allows you
                        to know the weather everywhere in the world.
                    </p>
                    <b-field label="Name :">
                        <b-input v-model="weatherDynamicData.model"></b-input>
                    </b-field>
                    <b-notification
                        v-if="weatherDynamicData.missingName"
                        type="is-danger"
                        role="alert"
                        :closable="false"
                    >
                        Widget need a name to be created.
                    </b-notification>
                </section>
                <footer class="modal-card-foot">
                    <button
                        class="button is-success"
                        @click="addWeatherDynamic"
                    >
                        Add this widget
                    </button>
                    <button
                        class="button"
                        @click="weatherDynamicData.isActive = false"
                    >
                        Cancel
                    </button>
                </footer>
            </div>
        </div>
        <div :class="['modal', weatherStaticData.isActive ? 'is-active' : '']">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Widget: Static Weather</p>
                    <button
                        class="delete"
                        aria-label="close"
                        @click="weatherStaticData.isActive = false"
                    ></button>
                </header>
                <section class="modal-card-body">
                    <p class="mb-4">
                        <strong>Description : </strong> This widget allows you
                        to know the weather in a certain place.
                    </p>
                    <b-field label="Name :">
                        <b-input
                            v-model="weatherStaticData.nameModel"
                        ></b-input>
                    </b-field>
                    <b-field
                        label="Where do you want the weather from ? (city, country) : "
                    >
                        <b-input
                            v-model="weatherStaticData.placeModel"
                        ></b-input>
                    </b-field>
                    <b-field label="Widger refresh time (in seconds) : ">
                        <b-slider
                            v-model="weatherStaticData.timerModel"
                            :max="120"
                            :min="1"
                        ></b-slider>
                    </b-field>
                    <b-notification
                        v-if="weatherStaticData.missing"
                        type="is-danger"
                        role="alert"
                        :closable="false"
                    >
                        Please fill all the params
                    </b-notification>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" @click="addWeatherStatic">
                        Add this widget
                    </button>
                    <button
                        class="button"
                        @click="weatherStaticData.isActive = false"
                    >
                        Cancel
                    </button>
                </footer>
            </div>
        </div>
    </section>
</template>

<script>
import WeatherDynamic from '@/components/WeatherService/WeatherDynamic.vue';
import API from '@/services/Weather.js';
import WeatherStatic from '../components/WeatherService/WeatherStatic.vue';

export default {
    name: 'WeatherService',

    components: {
        WeatherDynamic,
        WeatherStatic,
    },

    data: function () {
        return {
            widgets: [],
            weatherDynamicData: {
                isActive: false,
                missingName: false,
                model: '',
            },
            weatherStaticData: {
                isActive: false,
                missing: false,
                nameModel: '',
                placeModel: '',
                timerModel: 15,
            },
        };
    },

    methods: {
        addWeatherDynamic: async function () {
            if (this.weatherDynamicData.model.length == 0) {
                this.weatherDynamicData.missingName = true;
                return;
            }
            await API.addDynamicWeatherWidget(this.weatherDynamicData.model);
            this.weatherDynamicData.model = '';
            this.weatherDynamicData.missingName = false;
            this.weatherDynamicData.isActive = false;
            await this.fetchWidgets();
        },

        addWeatherStatic: async function () {
            if (
                this.weatherStaticData.nameModel.length == 0 ||
                this.weatherStaticData.placeModel.length == 0
            ) {
                this.weatherStaticData.missing = true;
                return;
            }

            await API.addStaticWeatherWidget(
                this.weatherStaticData.nameModel,
                this.weatherStaticData.placeModel,
                this.weatherStaticData.timerModel
            );

            this.weatherStaticData.nameModel = '';
            this.weatherStaticData.missing = false;
            this.weatherStaticData.placeModel = '';
            this.weatherStaticData.timerModel = 0;
            this.weatherStaticData.isActive = false;
            await this.fetchWidgets();
        },

        fetchWidgets: function () {
            this.widgets = [];
            API.getWeatherWidget().then((response) => {
                this.widgets = response.data;
            });
        },
    },

    mounted() {
        this.fetchWidgets();
    },
};
</script>
