<template>
    <section class="mt-6">
        <p class="has-text-weight-semibold mb-2">Add new Widgets:</p>
        <div class="column is-flex is-flex-wrap-wrap mb-6">
            <b-button
                class="is-align-self-flex-start"
                type="is-primary is-light"
                icon-left="lni-bitcoin"
                @click="cryptoViewerData.isActive = true"
                >Crypto rates</b-button
            >
            <b-button
                class="is-align-self-flex-start ml-3"
                type="is-primary is-light"
                icon-left="lni-timer"
                @click="countryTime.isActive = true"
                >Country Time</b-button
            >
            <b-button
                class="is-align-self-flex-start ml-3"
                type="is-primary is-light"
                icon-left="lni-wallet"
                @click="exchangeRates.isActive = true"
                >Exhange Rates</b-button
            >
        </div>
        <div class="is-flex is-flex-wrap-wrap">
            <div
                v-for="(widget, index) in widgets"
                v-bind:key="index"
                class="ml-3 mr-3 mt-3"
            >
                <crypto-viewer
                    v-if="widget.widgetName == 'crypto-viewer'"
                    :cryptoCurrency="widget.currency"
                    :cryptoName="widget.crypto"
                    :widgetName="widget.name"
                    :widgetID="widget.id"
                    :fetchWidget="getWidgets"
                    :timer="widget.timer"
                    :cryptoList="cryptos"
                    :currencyList="curencies"
                ></crypto-viewer>
                <country-time
                    v-if="widget.widgetName == 'country-time'"
                    :widgetCountry="widget.country"
                    :widgetID="widget.id"
                    :widgetTimer="widget.timer"
                    :fetchWidget="getWidgets"
                ></country-time>
                <exchange-rates
                    v-if="widget.widgetName == 'exchange-rates'"
                    :fetchWidget="getWidgets"
                    :widgetID="widget.id"
                    :widgetSymbol="widget.symbol"
                    :widgetBase="widget.base"
                    :widgetTimer="widget.timer"
                    :exchangeSymbols="exchangeSymbols"
                ></exchange-rates>

                <p></p>
            </div>
        </div>
        <div :class="['modal', cryptoViewerData.isActive ? 'is-active' : '']">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Widget: Crypto Rates</p>
                    <button
                        class="delete"
                        aria-label="close"
                        @click="cryptoViewerData.isActive = false"
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
                                v-model="cryptoViewerData.crypto"
                            >
                                <option
                                    v-for="crypto in cryptos"
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
                                v-model="cryptoViewerData.currency"
                            >
                                <option
                                    v-for="currency in curencies"
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
                                v-model="cryptoViewerData.timer"
                            ></b-slider>
                        </b-field>
                    </div>

                    <b-notification
                        v-if="cryptoViewerData.missing"
                        type="is-danger"
                        role="alert"
                        :closable="false"
                    >
                        Please fill all the params
                    </b-notification>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" @click="addCryptoViewer">
                        Add this widget
                    </button>
                    <button
                        class="button"
                        @click="cryptoViewerData.isActive = false"
                    >
                        Cancel
                    </button>
                </footer>
            </div>
        </div>
        <div :class="['modal', countryTime.isActive ? 'is-active' : '']">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Widget: Country Time</p>
                    <button
                        class="delete"
                        aria-label="close"
                        @click="countryTime.isActive = false"
                    ></button>
                </header>
                <section class="modal-card-body">
                    <p class="mb-3">
                        <strong>Description : </strong> This widget allows you
                        to know the date and the hour of any country.
                    </p>

                    <b-field label="Country: ">
                        <b-input v-model="countryTime.country"></b-input>
                    </b-field>
                    <div class="mt-3">
                        <b-field label="Widger refresh time (in seconds) : ">
                            <b-slider
                                :max="120"
                                :min="1"
                                v-model="countryTime.timer"
                            ></b-slider>
                        </b-field>
                    </div>

                    <b-notification
                        v-if="countryTime.missing"
                        type="is-danger"
                        role="alert"
                        :closable="false"
                    >
                        Please fill all the params
                    </b-notification>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" @click="addCountryTime">
                        Add this widget
                    </button>
                    <button
                        class="button"
                        @click="countryTime.isActive = false"
                    >
                        Cancel
                    </button>
                </footer>
            </div>
        </div>
        <div :class="['modal', exchangeRates.isActive ? 'is-active' : '']">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Widget: Exchanges Rates</p>
                    <button
                        class="delete"
                        aria-label="close"
                        @click="exchangeRates.isActive = false"
                    ></button>
                </header>
                <section class="modal-card-body">
                    <p class="mb-6">
                        <strong>Description : </strong> This widget allows you
                        know exchange rates between two monies.
                    </p>
                    <div
                        class="is-flex is-align-items-baseline is-justify-content-space-evenly"
                    >
                        <b-field label="Base currency :">
                            <b-select
                                placeholder="Select a name"
                                v-model="exchangeRates.base"
                            >
                                <option
                                    v-for="symbol in exchangeSymbols"
                                    :value="symbol"
                                    :key="symbol"
                                >
                                    {{ symbol }}
                                </option>
                            </b-select>
                        </b-field>
                        <p
                            class="is-align-self-center has-text-weight-bold is-size-4"
                        >
                            TO
                        </p>
                        <b-field label="Exchange to :">
                            <b-select
                                placeholder="Select a name"
                                v-model="exchangeRates.symbol"
                            >
                                <option
                                    v-for="symbol in exchangeSymbols"
                                    :value="symbol"
                                    :key="symbol"
                                >
                                    {{ symbol }}
                                </option>
                            </b-select>
                        </b-field>
                    </div>
                    <div class="mt-3">
                        <b-field label="Widger refresh time (in seconds) : ">
                            <b-slider
                                :max="120"
                                :min="1"
                                v-model="exchangeRates.timer"
                            ></b-slider>
                        </b-field>
                    </div>

                    <b-notification
                        v-if="exchangeRates.missing"
                        type="is-danger"
                        role="alert"
                        :closable="false"
                    >
                        Please fill all the params
                    </b-notification>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" @click="addExchangeRates">
                        Add this widget
                    </button>
                    <button
                        class="button"
                        @click="exchangeRates.isActive = false"
                    >
                        Cancel
                    </button>
                </footer>
            </div>
        </div>
    </section>
</template>

<script>
import CountryTime from '../components/FinanceService/CountryTime.vue';
import CryptoViewer from '../components/FinanceService/CryptoViewer.vue';
import ExchangeRates from '../components/FinanceService/ExchangeRates.vue';
import FinanceApi from '../services/Finance.js';

export default {
    name: 'FinanceService',
    components: { CryptoViewer, CountryTime, ExchangeRates },

    data: function () {
        return {
            widgets: [],
            show: true,

            cryptoViewerData: {
                isActive: false,
                missing: false,
                crypto: '',
                currency: '',
                timer: 10,
            },

            countryTime: {
                isActive: false,
                missing: false,
                country: '',
                timer: 10,
            },

            exchangeRates: {
                isActive: false,
                missing: false,
                base: '',
                symbol: '',
                timer: 10,
            },

            cryptos: [
                {
                    name: 'Bitcoin',
                    symbol: 'BTC',
                },
                {
                    name: 'Ethereum',
                    symbol: 'ETH',
                },
                {
                    name: 'Ripple',
                    symbol: 'XRP',
                },
                {
                    name: 'Tether',
                    symbol: 'USDT',
                },
                {
                    name: 'Cardano',
                    symbol: 'ADA',
                },
                {
                    name: 'Bitcoin Cash',
                    symbol: 'BCH',
                },
                {
                    name: 'Litecoin',
                    symbol: 'LTC',
                },
                {
                    name: 'Stellar',
                    symbol: 'XLM',
                },
            ],

            curencies: [
                {
                    name: 'Euros',
                    symbol: 'EUR',
                },
                {
                    name: 'American Dollars',
                    symbol: 'USD',
                },
            ],

            exchangeSymbols: [
                'CAD',
                'HKD',
                'ISK',
                'EUR',
                'PHP',
                'DKK',
                'HUF',
                'CZK',
                'AUD',
                'RON',
                'SEK',
                'IDR',
                'INR',
                'BRL',
                'RUB',
                'HRK',
                'JPY',
                'THB',
                'CHF',
                'SGD',
                'PLN',
                'BGN',
                'TRY',
                'CNY',
                'NOK',
                'NZD',
                'ZAR',
                'USD',
                'MXN',
                'ILS',
                'GBP',
                'KRW',
                'MYR',
            ],
        };
    },

    methods: {
        getWidgets: function () {
            this.widgets = [];
            FinanceApi.getWidgets().then((response) => {
                this.widgets = response.data;
            });
        },

        addCryptoViewer: function () {
            if (
                this.cryptoViewerData.crypto.length == 0 ||
                this.cryptoViewerData.currency.length == 0
            ) {
                this.cryptoViewerData.missing = true;
                return;
            }

            const name = this.getName();
            const widget = {
                name: name,
                crypto: this.cryptoViewerData.crypto,
                currency: this.cryptoViewerData.currency,
                timer: this.cryptoViewerData.timer,
            };
            FinanceApi.addCryptoViewer(widget).then(() => {
                (this.cryptoViewerData.isActive = false),
                    (this.cryptoViewerData.crypto = ''),
                    (this.cryptoViewerData.currency = ''),
                    (this.cryptoViewerData.timer = 10);
                this.getWidgets();
            });
        },

        addCountryTime: function () {
            if (this.countryTime.country.length == 0) {
                this.countryTime.missing = true;
                return;
            }

            const widget = {
                country: this.countryTime.country,
                timer: this.countryTime.timer,
            };

            FinanceApi.addCountryTime(widget).then(() => {
                this.countryTime.country = '';
                this.countryTime.isActive = false;
                this.getWidgets();
            });
        },

        addExchangeRates: function () {
            if (
                this.exchangeRates.symbol.length == 0 ||
                this.exchangeRates.base.length == 0
            ) {
                this.exchangeRates.missing = true;
                return;
            }

            const widget = {
                symbol: this.exchangeRates.symbol,
                base: this.exchangeRates.base,
                timer: this.exchangeRates.timer,
            };

            FinanceApi.addExchangeRates(widget).then(() => {
                (this.exchangeRates.isActive = false),
                    (this.exchangeRates.symbol = ''),
                    (this.exchangeRates.base = '');
                (this.exchangeRates.timer = 10),
                    (this.exchangeRates.missing = false);
                this.getWidgets();
            });
        },

        getName: function () {
            let name = '';

            this.cryptos.forEach((obj) => {
                if (obj.symbol == this.cryptoViewerData.crypto) name = obj.name;
            });

            this.curencies.forEach((obj) => {
                if (obj.symbol == this.cryptoViewerData.currency)
                    name = name + ' in ' + obj.name;
            });
            return name;
        },
    },

    mounted() {
        this.getWidgets();

        this.$nextTick(() => {});
    },
};
</script>

<style>
</style>