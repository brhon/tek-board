<template>
    <section>
        <div class="box">
            <article class="media">
                <div class="media-left">
                    <div>
                        <i class="lni lni-timer"></i>
                    </div>
                </div>

                <div class="media-content">
                    <div class="content">
                        <div>
                            <p class="is-size-5 has-text-weight-medium">
                                Country Time
                            </p>
                            <p class="has-text-weight-medium is-size-5">
                                {{ location }}
                            </p>
                        </div>
                        <div>
                            <div class="columns is-gapless mt-5 is-flex">
                                <div class="column mt-5">
                                    <img
                                        src="https://www.flaticon.com/svg/static/icons/svg/2972/2972531.svg"
                                        style="width: 64px; height: 64px"
                                    />
                                </div>
                                <div class="column">
                                    <p
                                        class="has-text-weight-medium mt-2 is-size-5"
                                    >
                                        {{ day }}
                                    </p>
                                    <p
                                        class="has-text-weight-bold mt-2 is-size-4"
                                    >
                                        {{ time }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="media-right">
                    <b-dropdown aria-role="list">
                        <b-button
                            class="ml-3"
                            slot="trigger"
                            size="is-small"
                            type="is-text"
                            icon-left="lni-cog"
                        ></b-button>
                        <b-dropdown-item
                            aria-role="listitem"
                            @click="edit.isActive = true"
                        >
                            <i class="lni lni-pencil"></i> Edit</b-dropdown-item
                        >
                        <b-dropdown-item
                            aria-role="listitem"
                            @click="deleteWidget"
                            ><i class="lni lni-trash"></i>
                            Delete</b-dropdown-item
                        >
                    </b-dropdown>
                </div>
            </article>
            <div :class="['modal', edit.isActive ? 'is-active' : '']">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Modify this widget</p>
                        <button
                            class="delete"
                            aria-label="close"
                            @click="edit.isActive = false"
                        ></button>
                    </header>
                    <section class="modal-card-body">
                        <p class="mb-3">
                            <strong>Description : </strong> This widget allows
                            you to know the date and the hour of any country.
                        </p>

                        <b-field label="Country: ">
                            <b-input v-model="edit.country"></b-input>
                        </b-field>
                        <div class="mt-3">
                            <b-field
                                label="Widger refresh time (in seconds) : "
                            >
                                <b-slider
                                    :max="120"
                                    :min="1"
                                    v-model="edit.timer"
                                ></b-slider>
                            </b-field>
                        </div>

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
                        <button class="button" @click="edit.isActive = false">
                            Cancel
                        </button>
                    </footer>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';

import FinanceApi from '../../services/Finance';

export default {
    name: 'CountryTime',
    props: {
        widgetID: String,
        widgetCountry: String,
        widgetTimer: Number,
        fetchWidget: Function,
    },

    data() {
        return {
            unformatedTime: '',
            time: '',
            day: '',
            location: '',
            timer: '',

            edit: {
                isActive: false,
                missing: false,
                country: this.widgetCountry,
                timer: this.widgetTimer,
            },
        };
    },

    methods: {
        getTime: async function () {
            axios
                .get(
                    `https://timezone.abstractapi.com/v1/current_time?api_key=a8f1a90aa8e84a3aa6c455e52f45fccb&location=${this.widgetCountry}`
                )
                .then(async (response) => {
                    this.unformatedTime = response.data.datetime;
                    this.location =
                        'Time and date in ' + response.data.requested_location;
                    this.format();
                });
        },

        format: function () {
            let time = this.unformatedTime.substr(10);
            time = time.substring(0, 6);
            let date = this.unformatedTime.substring(0, 10);

            date = dayjs(date).format('dddd DD MMMM YYYY');
            this.time = time;
            this.day = date;
        },

        deleteWidget: async function () {
            FinanceApi.deleteWidget(this.widgetID).then(() => {
                this.fetchWidget();
            });
        },

        cancelAutoUpdate() {
            clearInterval(this.widgetTimer);
            this.timer = '';
        },

        modifyWidget() {
            if (this.edit.country.length == 0) {
                this.edit.missing = true;
                return;
            }

            const widget = {
                widgetName: 'country-time',
                id: this.widgetID,
                country: this.edit.country,
                timer: this.edit.timer,
            };

            FinanceApi.modifyWidget(widget).then(() => {
                this.edit.country = '';
                this.edit.isActive = false;
                this.cancelAutoUpdate();
                this.fetchWidget();
            });
        },
    },

    async created() {
        this.getTime();
        clearInterval(this.timer);
        this.timer = setInterval(this.getTime, this.widgetTimer * 1000);
    },

    beforeDestroy() {
        clearInterval(this.timer);
    },
};
</script>

<style>
</style>