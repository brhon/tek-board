<template>
    <div class="box">
        <article class="media">
            <div class="media-left">
                <div>
                    <i class="lni lni-sun"></i>
                </div>
            </div>

            <div class="media-content">
                <div class="content">
                    <div>
                        <p class="is-size-5 has-text-weight-medium">Méteo</p>
                        <p>{{ widgetName }}</p>
                    </div>
                    <div v-if="searching">
                        <div
                            class="columns is-gapless mt-3 is-flex is-align-items-center"
                        >
                            <div class="column is-centered">
                                <p class="is-size-4 has-text-weight-medium">
                                    {{ weather.city }}
                                </p>
                                <p class="is-size-4 has-text-weight-bold">
                                    {{ Math.trunc(weather.temp) + ' °C' }}
                                </p>
                            </div>
                            <div
                                class="column is-centered is-flex is-align-items-center"
                            >
                                <img :src="weather.image" alt="" />
                                <p>
                                    {{
                                        weather.condition
                                            .charAt(0)
                                            .toUpperCase() +
                                        weather.condition.slice(1)
                                    }}
                                </p>
                            </div>
                        </div>
                        <div
                            class="columns is-gapless is-flex is-align-items-center"
                        >
                            <div class="column is-centered">
                                <p class="is-size-4 has-text-weight-bold">
                                    {{ weather.humidity + '% ' }}
                                </p>
                                <p>humidity</p>
                            </div>
                            <div
                                class="column is-centered is-flex is-align-items-center"
                            >
                                <img class="ml-5" :src="weather.flag" alt="" />
                                <p class="ml-4 is-size-4 has-text-weight-bold">
                                    {{ weather.country }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="media-right">
                <b-dropdown aria-role="list">
                    <b-button
                        slot="trigger"
                        size="is-small"
                        type="is-text"
                        icon-left="lni-cog"
                    ></b-button>
                    <b-dropdown-item
                        aria-role="listitem"
                        @click="edit.modal = true"
                    >
                        <i class="lni lni-pencil"></i> Edit</b-dropdown-item
                    >
                    <b-dropdown-item aria-role="listitem" @click="deleteWidget"
                        ><i class="lni lni-trash"></i> Delete</b-dropdown-item
                    >
                </b-dropdown>
            </div>
        </article>
        <div :class="['modal', edit.modal ? 'is-active' : '']">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Modify this widget</p>
                    <button
                        class="delete"
                        aria-label="close"
                        @click="edit.modal = false"
                    ></button>
                </header>
                <section class="modal-card-body">
                    <p class="mb-4">
                        <strong>Description : </strong> This widget allows you
                        to know the weather in a certain place.
                    </p>
                    <b-field label="Widget name :">
                        <b-input v-model="edit.nameModel"></b-input>
                    </b-field>
                    <b-field
                        label="Where do you want the weather from ? (city, country) : "
                    >
                        <b-input v-model="edit.placeModel"></b-input>
                    </b-field>
                    <b-field
                        label="Timer in seconds (widget will restart every x seconds) : "
                    >
                        <b-slider
                            v-model="edit.timerModel"
                            :max="120"
                            :min="1"
                        ></b-slider>
                    </b-field>
                    <b-notification
                        v-if="edit.missing"
                        type="is-danger"
                        role="alert"
                        :closable="false"
                    >
                        Please fill all the params
                    </b-notification>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" @click="modifyWidget">
                        Apply
                    </button>
                    <button class="button" @click="edit.modal = false">
                        Cancel
                    </button>
                </footer>
            </div>
        </div>
    </div>
</template>

<script>
import Weather from '@/services/Weather.js';
export default {
    name: 'WeatherStatic',

    data: function () {
        return {
            dropdownActive: false,
            timer: 0,
            searching: false,
            weather: [
                {
                    temp: '20',
                    image: '',
                    condition: '',
                    humidity: '',
                    flag: '',
                    country: '',
                },
            ],
            edit: {
                modal: false,
                nameModel: this.widgetName,
                placeModel: this.widgetPlace,
                timerModel: this.widgetTimer,
                missing: '',
            },
        };
    },

    props: {
        widgetName: String,
        widgetId: String,
        widgetPlace: String,
        widgetTimer: Number,
        fetchWidgets: Function,
    },

    methods: {
        getWeather: function () {
            this.searching = false;
            Weather.weatherByCity(this.widgetPlace).then((response) => {
                if (response.data.cod == '404') return;
                this.weather.city = response.data.name;
                this.weather.temp = response.data.main.temp;
                this.weather.image = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
                this.weather.condition = response.data.weather[0].description;
                this.weather.humidity = response.data.main.humidity;
                this.weather.flag = `https://www.countryflags.io/${response.data.sys.country}/flat/64.png`;
                this.weather.country = response.data.sys.country;
                this.searching = true;
            });
        },

        deleteWidget: function () {
            Weather.deleteWeatherWidget(this.widgetId).then(() => {
                this.fetchWidgets();
            });
        },

        modifyWidget: async function () {
            if (this.edit.nameModel == 0) {
                this.edit.missing = true;
                return;
            }

            const widgetNewParams = {
                id: this.widgetId,
                widgetName: 'static-weather',
                name: this.edit.nameModel,
                place: this.edit.placeModel,
                timer: this.edit.timerModel,
            };

            this.edit.modal = false;

            await Weather.modifyWeatherWidget(widgetNewParams).then(() => {
                this.cancelAutoUpdate();
                this.fetchWidgets();
            });
        },

        cancelAutoUpdate() {
            clearInterval(this.timer);
            this.timer = '';
        },
    },

    created() {
        this.getWeather();
        this.timer = setInterval(this.getWeather, this.widgetTimer * 1000);
    },

    beforeDestroy() {
        clearInterval(this.timer);
    },
};
</script>

<style>
p {
    margin: 0 !important;
}
</style>