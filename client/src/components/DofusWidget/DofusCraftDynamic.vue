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
                                Dofus Craft Search
                            </p>
                            <p>{{ widgetName }}</p>
                        </div>
                        <div class="mt-5">
                            <b-field>
                                <b-input
                                    placeholder="Equipements"
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
                        <li class="is-size-5 has-text-weight- ml-5 mb-3">
                            Ingrediant :
                        </li>
                        <li
                            v-for="(effect, name) in itemRecipe"
                            class="is-size-6 has-text-weight- ml-5"
                            v-bind:key="name"
                        >
                            <!-- <p v-if="effect[Object.keys(effect)[0]]['max']">
                                +{{ effect[Object.keys(effect)[0]]['min'] }} à
                                {{ effect[Object.keys(effect)[0]]['max'] }} en
                                {{ Object.keys(effect)[0] }}
                            </p> -->
                            <article>
                                <div class="media">
                                    <div class="media-right ml-0">
                                        <img
                                            :src="
                                                effect[Object.keys(effect)[0]][
                                                    'imgUrl'
                                                ]
                                            "
                                            style="width: 30px; height: 30px"
                                            referrerpolicy="no-referrer"
                                        />
                                    </div>
                                    <div class="media-left ml-4">
                                        <p>
                                            x{{
                                                effect[Object.keys(effect)[0]][
                                                    'quantity'
                                                ]
                                            }}
                                            {{ Object.keys(effect)[0] }}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
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
                        to know the recipe to craft any item.
                    </p>
                    <b-field label="Widget name :">
                        <b-input v-model="edit.nameModel"></b-input>
                    </b-field>
                    <b-notification
                        v-if="edit.missingName"
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
    name: 'DofusCraftDynamic',

    data: function () {
        return {
            input: '',
            equipmentImageUrl: String,
            itemRecipe: [],
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
        getItemName: async function (value) {
            this.searching = false;
            this.equipmentImageUrl = '';
            this.itemLvl = 0;
            this.itemRecipe = [];
            await axios
                .get('https://fr.dofus.dofapi.fr/equipments/')
                .then((response) => {
                    response.data.forEach((element) => {
                        if (element.name == value) {
                            console.log(element);
                            this.equipmentImageUrl = element.imgUrl;
                            this.itemLvl = element.level.toString();
                            this.itemRecipe = element.recipe;
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

            this.edit.missingName = false;
            this.edit.modal = false;

            const newParams = {
                id: this.widgetId,
                widgetName: 'dofus-craft-search',
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