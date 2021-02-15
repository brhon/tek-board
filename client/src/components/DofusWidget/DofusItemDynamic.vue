<template>
    <section>
        <div class="box">
            <article class="media">
                <div class="media-left">
                    <div>
                        <img
                            src="../../assets/images/dofusLogo.jpg"
                            style="width: 30px; height: 30px"
                        />
                    </div>
                </div>
                <div class="media-content">
                    <div class="content">
                        <div>
                            <p class="is-size-5 has-text-weight-medium">
                                Dofus Item Search
                            </p>
                            <p>{{ widgetName }}</p>
                        </div>
                        <div class="mt-5">
                            <b-field>
                                <b-input
                                    placeholder="Equipement"
                                    v-model="input"
                                    rounded
                                ></b-input>
                            </b-field>
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
                        <b-dropdown-item
                            aria-role="listitem"
                            @click="deleteWidget"
                            ><i class="lni lni-trash"></i>
                            Delete</b-dropdown-item
                        >
                    </b-dropdown>
                </div>
            </article>
            <div class="columns is-gapless is-flex mt-5 mb-1" v-if="searching">
                <p class="is-size-5 has-text-weight-bold">
                    {{ input }}
                </p>
            </div>
            <div
                class="columns is-gapless is-flex is-align-items-center mt-3"
                v-if="searching"
            >
                <div class="column is-flex is-align-items-center mr-4">
                    <img
                        :src="equipmentImageUrl"
                        style="width: 85px; height: 85px"
                        referrerpolicy="no-referrer"
                    />
                    <p class="is-size-5 has-text-weight-bold mr-6">
                        Lvl {{ itemLvl }}
                    </p>
                    <ul>
                        <li class="is-size-5 has-text-weight- ml-5">Bonus :</li>
                        <li
                            v-for="(effect, name) in itemEffects"
                            class="is-size-6 has-text-weight- ml-5"
                            v-bind:key="name"
                        >
                            <p v-if="effect[Object.keys(effect)[0]]['max']">
                                +{{ effect[Object.keys(effect)[0]]['min'] }} à
                                {{ effect[Object.keys(effect)[0]]['max'] }} en
                                {{ Object.keys(effect)[0] }}
                            </p>
                            <p v-if="!effect[Object.keys(effect)[0]]['max']">
                                +{{ effect[Object.keys(effect)[0]]['min'] }}
                                {{ Object.keys(effect)[0] }}
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div :class="['modal', edit.modal ? 'is-active' : '']">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Widget: Dofus Item</p>
                    <button
                        class="delete"
                        aria-label="close"
                        @click="edit.modal = false"
                    ></button>
                </header>
                <section class="modal-card-body">
                    <p class="mb-4">
                        <strong>Description : </strong> This widget will give
                        you information about a Dofus item.
                    </p>
                    <b-field label="Widget name :">
                        <b-input v-model="edit.nameModel"></b-input>
                    </b-field>
                    <b-notification
                        v-if="edit.missing"
                        type="is-danger"
                        role="alert"
                        :closable="false"
                    >
                        Please fill all the params.
                    </b-notification>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" @click="modifyWidget">
                        Add this widget
                    </button>
                    <button class="button" @click="edit.modal = false">
                        Cancel
                    </button>
                </footer>
            </div>
        </div>
    </section>
</template>



<script>
import DofusAPI from '../../services/Dofus';
import axios from 'axios';

export default {
    name: 'DofusItemDynamic',

    data: function () {
        return {
            input: '',
            equipmentImageUrl: String,
            itemEffects: [],
            itemLvl: String,
            edit: {
                modal: false,
                nameModel: this.widgetName,
                missing: false,
            },
            searching: false,
        };
    },

    props: {
        widgetName: String,
        widgetId: String,
        fetchWidgets: Function,
    },

    watch: {
        input: function (value) {
            this.getItemName(value);
        },
    },

    methods: {
        getItemName: async function () {
            this.searching = false;
            this.equipmentImageUrl = '';
            this.itemLvl = 0;
            this.itemEffects = [];
            await axios
                .get('https://fr.dofus.dofapi.fr/equipments/')
                .then((response) => {
                    response.data.forEach((element) => {
                        if (element.name == this.input) {
                            this.equipmentImageUrl = element.imgUrl;
                            this.itemLvl = element.level.toString();
                            this.itemEffects = element.statistics;
                            this.searching = true;
                        }
                    });
                });
        },
        deleteWidget: function () {
            DofusAPI.deleteDofusWidget(this.widgetId).then(() => {
                this.fetchWidgets();
            });
        },

        modifyWidget: function () {
            if (this.edit.nameModel.length == 0) {
                this.edit.missing = true;
                return;
            }

            this.edit.modal = false;
            this.edit.missing = false;

            const newParams = {
                id: this.widgetId,
                widgetName: 'dofus-item-search',
                name: this.edit.nameModel,
            };

            DofusAPI.modifyDofusWidget(newParams).then(() => {
                this.fetchWidgets();
                this.getItemName();
            });
        },
    },
};
</script>

<style>
p {
    margin: 0 !important;
}
</style>