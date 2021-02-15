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
                        <p class="is-size-5 has-text-weight-medium">Weather</p>
                        <p>{{ widgetName }}</p>
                    </div>
                    <div class="mt-5">
                        <b-field>
                            <b-input
                                placeholder="Ville/Pays"
                                v-model="input"
                                rounded
                            ></b-input>
                        </b-field>
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
                        to know the weather everywhere in the world.
                    </p>
                    <b-field label="Name :">
                        <b-input v-model="edit.model"></b-input>
                    </b-field>
                    <b-notification
                        v-if="edit.missing"
                        type="is-danger"
                        role="alert"
                        :closable="false"
                    >
                        Widget must have a name
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
    name: 'WeatherDynamic',

    data: function () {
        return {
            input: '',
            dropdownActive: false,
            searching: false,
            weather: [
                {
                    city: '',
                    temp: '',
                    image: '',
                    condition: '',
                    humidity: '',
                    flag: '',
                    country: '',
                },
            ],
            edit: {
                modal: false,
                model: this.widgetName,
                missing: '',
            },
        };
    },

    props: {
        widgetName: String,
        widgetId: String,
        fetchWidgets: Function,
    },

    watch: {
        input: function (value) {
            this.getWeather(value);
        },
        deep: true,
    },

    methods: {
        getWeather: function (city) {
            this.searching = false;
            Weather.weatherByCity(city).then((response) => {
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
            if (this.edit.model.length == 0) {
                this.edit.missing = true;
                return;
            }
            const widgetNewParams = {
                id: this.widgetId,
                widgetName: 'dynamic-weather',
                name: this.edit.model,
            };
            await Weather.modifyWeatherWidget(widgetNewParams);
            this.fetchWidgets();
            this.edit.modal = false;
        },
    },
};
</script>

<style>
p {
    margin: 0 !important;
}
</style>