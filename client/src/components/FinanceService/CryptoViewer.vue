<template>
    <section>
        <div class="box">
            <article class="media">
                <div class="media-left">
                    <div>
                        <i class="lni lni-bitcoin"></i>
                    </div>
                </div>

                <div class="media-content">
                    <div class="content">
                        <div>
                            <p class="is-size-5 has-text-weight-medium">
                                Crypto Rates
                            </p>
                            <p>{{ widgetName }}</p>
                        </div>
                        <div v-if="searching">
                            <div
                                class="columns is-gapless mt-5 is-flex is-align-items-center"
                            >
                                <div class="column">
                                    <img
                                        :src="crytpo.img"
                                        style="width: 48px; height: 48px"
                                    />
                                </div>
                                <div class="column ml-5">
                                    <p class="has-text-weight-bold is-size-4">
                                        {{ crytpo.price }}
                                    </p>
                                    <p class="has-text-weight-medium is-size-6">
                                        {{ cryptoCurrency }}
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
        </div>
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
                    <p class="mb-6">
                        <strong>Description : </strong> This widget allows you
                        know the price of a cryptocurrency.
                    </p>
                    <div
                        class="is-flex is-align-items-baseline is-justify-content-space-evenly"
                    >
                        <b-field label="Select a crypto :">
                            <b-select
                                placeholder="Select a name"
                                v-model="edit.crypto"
                            >
                                <option
                                    v-for="crypto in cryptoList"
                                    :value="crypto.symbol"
                                    :key="crypto.symbol"
                                >
                                    {{ crypto.name }}
                                </option>
                            </b-select>
                        </b-field>

                        <p
                            class="is-align-self-center has-text-weight-bold is-size-4"
                        >
                            IN
                        </p>
                        <b-field label="Select a currency :">
                            <b-select
                                placeholder="Select a name"
                                v-model="edit.currency"
                            >
                                <option
                                    v-for="currency in currencyList"
                                    :value="currency.symbol"
                                    :key="currency.symbol"
                                >
                                    {{ currency.name }}
                                </option>
                            </b-select>
                        </b-field>
                    </div>
                    <div class="mt-3">
                        <b-field label="Widger refresh time (in seconds) : ">
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
    </section>
</template>

<script>
import axios from 'axios';
import FinanceApi from '../../services/Finance.js';

export default {
    name: 'CryptoViewer',

    props: {
        cryptoName: String,
        cryptoCurrency: String,
        widgetName: String,
        widgetID: String,
        fetchWidget: Function,
        timer: Number,
        cryptoList: Array,
        currencyList: Array,
    },

    data: function () {
        return {
            searching: false,
            widgetTimer: 0,
            currency: '',
            crytpo: {
                price: 0,
                img: '',
            },
            edit: {
                isActive: false,
                missing: false,
                crypto: this.cryptoName,
                currency: this.cryptoCurrency,
                timer: this.timer,
            },
        };
    },

    methods: {
        fetch: function () {
            this.searching = false;
            axios
                .get(
                    `https://api.nomics.com/v1/currencies/ticker?key=6adadb32f11e49c4a6289a970d4b4970&ids=${this.cryptoName},&convert=${this.cryptoCurrency}&per-page=100&page=1`
                )
                .then((response) => {
                    this.crytpo.price = parseFloat(
                        response.data[0].price
                    ).toFixed(4);
                    this.crytpo.img = response.data[0].logo_url;
                    this.searching = true;
                });
        },

        deleteWidget: async function () {
            FinanceApi.deleteWidget(this.widgetID).then(() => {
                this.fetchWidget();
            });
        },

        modifyWidget: function () {
            if (
                this.edit.crypto.length == 0 ||
                this.edit.currency.length == 0
            ) {
                this.edit.missing = true;
                return;
            }

            const name = this.getName();

            const widget = {
                id: this.widgetID,
                name: name,
                crypto: this.edit.crypto,
                currency: this.edit.currency,
                timer: this.edit.timer,
            };

            FinanceApi.modifyWidget(widget).then(() => {
                (this.edit.isActive = false),
                    (this.edit.crypto = ''),
                    (this.edit.currency = ''),
                    (this.edit.timer = 10);
                this.cancelAutoUpdate();
                this.fetchWidget();
            });
        },

        getName: function () {
            let name = '';

            this.cryptoList.forEach((obj) => {
                if (obj.symbol == this.edit.crypto) name = obj.name;
            });

            this.currencyList.forEach((obj) => {
                if (obj.symbol == this.edit.currency)
                    name = name + ' in ' + obj.name;
            });
            return name;
        },

        cancelAutoUpdate() {
            clearInterval(this.widgetTimer);
            this.timer = '';
        },
    },

    created() {
        this.fetch();
        this.widgetTimer = setInterval(this.fetch, this.timer * 1000);

        if (this.cryptoCurrency == 'USD') this.currency = ' USD';
        if (this.cryptoCurrency == 'EUR') this.currency = ' EUR';
    },

    beforeDestroy() {
        clearInterval(this.widgetTimer);
    },
};
</script>

<style>
</style>